from __future__ import annotations

import sys
from pathlib import Path

import click
from rich.console import Console
from rich.table import Table

from .collector import CollectorService
from .config import load_config
from .formatter import FormatterService
from .scheduler import SchedulerService
from .storage import Storage
from .utils import setup_logging

console = Console()


def _make_storage(config_path: str | None) -> tuple:
    cfg = load_config(config_path)
    db_path = Path(cfg.data_dir) / "content.db"
    storage = Storage(db_path)
    return cfg, storage


@click.group()
@click.option("--config", "config_path", default=None, help="設定ファイルパス (default: config/default.yaml)")
@click.option("--verbose", is_flag=True, help="デバッグログを有効化")
@click.pass_context
def main(ctx: click.Context, config_path: str | None, verbose: bool) -> None:
    """AutoContent — 自動コンテンツ準備パイプライン"""
    ctx.ensure_object(dict)
    ctx.obj["config_path"] = config_path
    cfg = load_config(config_path)
    setup_logging("DEBUG" if verbose else cfg.log_level)
    ctx.obj["config"] = cfg


# ── run ────────────────────────────────────────────────────────────────────


@main.command()
@click.pass_context
def run(ctx: click.Context) -> None:
    """スケジューラデーモンを起動（Ctrl+C で停止）"""
    cfg = ctx.obj["config"]
    db_path = Path(cfg.data_dir) / "content.db"
    storage = Storage(db_path)
    svc = SchedulerService(cfg, storage)
    svc.start()


# ── collect ────────────────────────────────────────────────────────────────


@main.command()
@click.option("--source", "source_ids", multiple=True, help="対象ソースID（複数指定可、省略時は全て）")
@click.pass_context
def collect(ctx: click.Context, source_ids: tuple[str, ...]) -> None:
    """記事を今すぐ収集する"""
    cfg = ctx.obj["config"]
    db_path = Path(cfg.data_dir) / "content.db"
    storage = Storage(db_path)
    svc = CollectorService(cfg, storage)
    results = svc.run(list(source_ids) if source_ids else None)
    total = sum(results.values())

    table = Table(title="収集結果", show_header=True)
    table.add_column("ソースID")
    table.add_column("追加件数", justify="right")
    for src_id, n in results.items():
        table.add_row(src_id, str(n))
    table.add_row("[bold]合計[/bold]", f"[bold]{total}[/bold]")
    console.print(table)


# ── format ─────────────────────────────────────────────────────────────────


@main.command("format")
@click.option("--mode", default="articles", type=click.Choice(["articles", "summary"]), help="生成モード")
@click.option("--days", default=7, help="まとめ対象日数（summaryモード時）")
@click.option("--limit", default=20, help="処理する最大記事数")
@click.pass_context
def format_cmd(ctx: click.Context, mode: str, days: int, limit: int) -> None:
    """収集記事からMarkdown下書きを生成する"""
    cfg = ctx.obj["config"]
    db_path = Path(cfg.data_dir) / "content.db"
    storage = Storage(db_path)
    svc = FormatterService(cfg, storage)

    if mode == "summary":
        draft = svc.run_summary(days=days)
        if draft:
            console.print(f"[green]まとめ下書き生成完了:[/green] {draft.output_path}")
        else:
            console.print("[yellow]生成できる記事がありません[/yellow]")
    else:
        drafts = svc.run_new_articles(limit=limit)
        console.print(f"[green]{len(drafts)}件の下書きを生成しました[/green]")
        for d in drafts:
            console.print(f"  → {d.output_path}")


# ── status ─────────────────────────────────────────────────────────────────


@main.command()
@click.pass_context
def status(ctx: click.Context) -> None:
    """DB統計と未処理件数を表示する"""
    cfg = ctx.obj["config"]
    db_path = Path(cfg.data_dir) / "content.db"
    storage = Storage(db_path)

    art_counts = storage.count_articles()
    draft_counts = storage.count_drafts()

    console.print(f"\n[bold]トピック:[/bold] {cfg.topic.name}")
    console.print(f"[bold]ソース数:[/bold] {len(cfg.enabled_sources())} 件 (有効)\n")

    art_table = Table(title="記事", show_header=True)
    art_table.add_column("ステータス")
    art_table.add_column("件数", justify="right")
    for status_name, cnt in art_counts.items():
        art_table.add_row(status_name, str(cnt))
    art_table.add_row("[bold]合計[/bold]", f"[bold]{sum(art_counts.values())}[/bold]")
    console.print(art_table)

    console.print()

    draft_table = Table(title="下書き", show_header=True)
    draft_table.add_column("ステータス")
    draft_table.add_column("件数", justify="right")
    for status_name, cnt in draft_counts.items():
        draft_table.add_row(status_name, str(cnt))
    draft_table.add_row("[bold]合計[/bold]", f"[bold]{sum(draft_counts.values())}[/bold]")
    console.print(draft_table)


# ── list ───────────────────────────────────────────────────────────────────


@main.command("list")
@click.option("--type", "item_type", default="drafts", type=click.Choice(["drafts", "articles"]))
@click.option("--limit", default=20)
@click.pass_context
def list_cmd(ctx: click.Context, item_type: str, limit: int) -> None:
    """収集記事・下書き一覧を表示する"""
    cfg = ctx.obj["config"]
    db_path = Path(cfg.data_dir) / "content.db"
    storage = Storage(db_path)

    if item_type == "drafts":
        items = storage.get_drafts(limit=limit)
        table = Table(title=f"下書き一覧 (最新{limit}件)", show_header=True)
        table.add_column("ID", justify="right")
        table.add_column("タイトル")
        table.add_column("テンプレート")
        table.add_column("ステータス")
        table.add_column("作成日時")
        for d in items:
            table.add_row(str(d.id), d.title[:50], d.template_used, d.status, d.created_at)
        console.print(table)
    else:
        items = storage.get_recent_articles(limit=limit)
        table = Table(title=f"記事一覧 (最新{limit}件)", show_header=True)
        table.add_column("ID", justify="right")
        table.add_column("タイトル")
        table.add_column("ソース")
        table.add_column("スコア", justify="right")
        table.add_column("ステータス")
        for a in items:
            table.add_row(str(a.id), (a.title or "")[:50], a.source_id, f"{a.score:.2f}", a.status)
        console.print(table)


# ── config ─────────────────────────────────────────────────────────────────


@main.command("config")
@click.option("--validate", is_flag=True, help="設定を検証して終了")
@click.pass_context
def config_cmd(ctx: click.Context, validate: bool) -> None:
    """設定ファイルを検証・表示する"""
    config_path = ctx.obj["config_path"]
    try:
        cfg = load_config(config_path)
        console.print("[green]設定ファイル: 有効[/green]")
        console.print(f"  トピック  : {cfg.topic.name}")
        console.print(f"  キーワード: {', '.join(cfg.topic.keywords)}")
        console.print(f"  ソース数  : {len(cfg.sources)} ({len(cfg.enabled_sources())} 有効)")
        console.print(f"  スケジューラ: {'有効' if cfg.schedule.enabled else '無効'}")
        console.print(f"  収集間隔  : {cfg.schedule.collect}")
    except Exception as e:
        console.print(f"[red]設定エラー: {e}[/red]")
        if validate:
            sys.exit(1)
