from __future__ import annotations

import logging
from pathlib import Path

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from .collector import CollectorService
from .config import AppConfig
from .formatter import FormatterService
from .storage import Storage

logger = logging.getLogger(__name__)


def _parse_cron(expr: str, timezone: str) -> CronTrigger:
    parts = expr.strip().split()
    if len(parts) != 5:
        raise ValueError(f"cronの書式が不正です: {expr!r} (分 時 日 月 曜日)")
    minute, hour, day, month, day_of_week = parts
    return CronTrigger(
        minute=minute,
        hour=hour,
        day=day,
        month=month,
        day_of_week=day_of_week,
        timezone=timezone,
    )


class SchedulerService:
    def __init__(self, config: AppConfig, storage: Storage, templates_dir: Path | str = "templates") -> None:
        self.config = config
        self.storage = storage
        self.templates_dir = Path(templates_dir)
        self._scheduler = BlockingScheduler()

    def _collect_job(self) -> None:
        logger.info("[スケジューラ] 収集ジョブ開始")
        collector = CollectorService(self.config, self.storage)
        results = collector.run()
        total = sum(results.values())
        logger.info("[スケジューラ] 収集完了: 合計 %d件追加", total)

    def _format_job(self) -> None:
        logger.info("[スケジューラ] フォーマットジョブ開始")
        formatter = FormatterService(self.config, self.storage, self.templates_dir)
        drafts = formatter.run_new_articles(limit=30)
        logger.info("[スケジューラ] 下書き生成完了: %d件", len(drafts))

    def _summary_job(self) -> None:
        logger.info("[スケジューラ] 週次まとめジョブ開始")
        formatter = FormatterService(self.config, self.storage, self.templates_dir)
        draft = formatter.run_summary(days=7)
        if draft:
            logger.info("[スケジューラ] まとめ生成完了: %s", draft.output_path)

    def _cleanup_job(self) -> None:
        days = self.config.schedule.cleanup_days
        logger.info("[スケジューラ] クリーンアップジョブ (保持期間: %d日) — 未実装", days)

    def start(self) -> None:
        if not self.config.schedule.enabled:
            logger.warning("スケジューラは設定で無効化されています")
            return

        tz = self.config.schedule.timezone

        try:
            collect_trigger = _parse_cron(self.config.schedule.collect, tz)
            self._scheduler.add_job(self._collect_job, trigger=collect_trigger, id="collect", replace_existing=True)
            logger.info("収集ジョブ登録: %s (%s)", self.config.schedule.collect, tz)
        except Exception as e:
            logger.error("収集ジョブ登録失敗: %s", e)

        # 収集の30分後にフォーマット（固定オフセット）
        self._scheduler.add_job(
            self._format_job,
            trigger="interval",
            minutes=30,
            id="format",
            replace_existing=True,
        )
        logger.info("フォーマットジョブ登録: 30分ごと")

        # 毎週月曜7時にまとめ生成
        self._scheduler.add_job(
            self._summary_job,
            trigger=CronTrigger(day_of_week="mon", hour=7, timezone=tz),
            id="summary",
            replace_existing=True,
        )
        logger.info("まとめジョブ登録: 毎週月曜 07:00 (%s)", tz)

        logger.info("スケジューラ起動 (Ctrl+C で停止)")
        try:
            self._scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            logger.info("スケジューラ停止")
