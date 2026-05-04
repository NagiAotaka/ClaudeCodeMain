from __future__ import annotations

import logging
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

from .config import AppConfig
from .storage import Article, Draft, Storage
from .utils import build_filename, now_iso, today_str, truncate, write_markdown

logger = logging.getLogger(__name__)

# テンプレートが見つからない場合のフォールバック
SUMMARY_TEMPLATE_FALLBACK = """\
# {{ topic }} — 最新記事まとめ（{{ date }}）

> キーワード: {{ keywords | join(", ") }}

{% for article in articles %}
## {{ loop.index }}. {{ article.title }}

- **URL**: {{ article.url }}
{% if article.published_at %}- **公開日**: {{ article.published_at }}{% endif %}
- **スコア**: {{ "%.2f" | format(article.score) }}

{{ article.content | truncate(300) }}

---
{% endfor %}

<!-- 下書きステータス: draft — 公開前に内容を確認してください -->
"""

ARTICLE_TEMPLATE_FALLBACK = """\
# {{ article.title }}

- **出典**: [{{ article.source_id }}]({{ article.url }})
{% if article.published_at %}- **公開日**: {{ article.published_at }}{% endif %}

---

{{ article.content }}

---

<!-- 下書きステータス: draft — 公開前に内容を確認してください -->
"""


def _make_env(templates_dir: Path) -> Environment:
    if templates_dir.exists():
        env = Environment(
            loader=FileSystemLoader(str(templates_dir)),
            autoescape=select_autoescape([]),
            keep_trailing_newline=True,
        )
    else:
        env = Environment(
            loader=None,
            autoescape=select_autoescape([]),
            keep_trailing_newline=True,
        )
    env.filters["truncate"] = lambda s, n=300: truncate(str(s), n)
    return env


def _render(env: Environment, template_name: str, fallback: str, **ctx: object) -> str:
    try:
        if env.loader:
            tmpl = env.get_template(template_name)
            return tmpl.render(**ctx)
    except Exception:
        pass
    return env.from_string(fallback).render(**ctx)


class FormatterService:
    def __init__(self, config: AppConfig, storage: Storage, templates_dir: Path | str = "templates") -> None:
        self.config = config
        self.storage = storage
        self.templates_dir = Path(templates_dir)
        self.env = _make_env(self.templates_dir)

    def format_summary(self, articles: list[Article], days: int = 7) -> Draft | None:
        if not articles:
            logger.info("まとめ生成スキップ: 記事なし")
            return None

        date = today_str()
        topic = self.config.topic.name
        keywords = self.config.topic.keywords
        output_dir = Path(self.config.output.drafts_dir)

        body = _render(
            self.env,
            "summary.md.j2",
            SUMMARY_TEMPLATE_FALLBACK,
            topic=topic,
            date=date,
            keywords=keywords,
            articles=articles,
            days=days,
        )

        title = f"{topic} 最新まとめ（{date}）"
        filename = build_filename(self.config.output.filename_template, title) + ".md"
        output_path = output_dir / filename

        frontmatter = {
            "title": title,
            "date": date,
            "topic": topic,
            "article_count": len(articles),
            "status": "draft",
            "generated_at": now_iso(),
        }
        write_markdown(output_path, frontmatter, body)

        draft = Draft(
            title=title,
            body=body,
            template_used="summary",
            source_ids=[a.id for a in articles],
            output_path=str(output_path),
        )
        draft_id = self.storage.save_draft(draft)
        draft.id = draft_id

        for article in articles:
            if article.id:
                self.storage.mark_article_formatted(article.id)

        logger.info("まとめ下書き生成: %s (%d記事)", output_path, len(articles))
        return draft

    def format_article(self, article: Article) -> Draft | None:
        date = today_str()
        output_dir = Path(self.config.output.collected_dir)

        body = _render(
            self.env,
            "article.md.j2",
            ARTICLE_TEMPLATE_FALLBACK,
            article=article,
            date=date,
        )

        filename = build_filename(self.config.output.filename_template, article.title or "untitled") + ".md"
        output_path = output_dir / filename

        frontmatter = {
            "title": article.title or "untitled",
            "date": date,
            "source_id": article.source_id,
            "url": article.url,
            "score": article.score,
            "status": "draft",
            "generated_at": now_iso(),
        }
        write_markdown(output_path, frontmatter, body)

        draft = Draft(
            title=article.title or "untitled",
            body=body,
            template_used="article",
            source_ids=[article.id] if article.id else [],
            output_path=str(output_path),
        )
        draft_id = self.storage.save_draft(draft)
        draft.id = draft_id

        if article.id:
            self.storage.mark_article_formatted(article.id)

        logger.info("記事下書き生成: %s", output_path)
        return draft

    def run_summary(self, days: int = 7, min_score: float = 0.0) -> Draft | None:
        articles = self.storage.get_recent_articles(limit=30, days=days)
        if min_score > 0:
            articles = [a for a in articles if a.score >= min_score]
        return self.format_summary(articles, days=days)

    def run_new_articles(self, limit: int = 20) -> list[Draft]:
        articles = self.storage.get_new_articles(limit=limit)
        drafts = []
        for article in articles:
            draft = self.format_article(article)
            if draft:
                drafts.append(draft)
        return drafts
