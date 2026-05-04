from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

import yaml
from pydantic import BaseModel, Field, field_validator


class TopicConfig(BaseModel):
    name: str = "未設定"
    keywords: list[str] = Field(default_factory=list)
    language: str = "ja"


class ContentFilter(BaseModel):
    mode: Literal["any", "all"] = "any"
    keywords: list[str] = Field(default_factory=list)


class SourceConfig(BaseModel):
    id: str
    name: str
    type: Literal["rss", "web_page"]
    url: str
    enabled: bool = True
    max_per_run: int = 20
    request_delay_seconds: float = 2.0
    respect_robots_txt: bool = True
    content_filter: ContentFilter | None = None


class ScheduleConfig(BaseModel):
    enabled: bool = True
    timezone: str = "Asia/Tokyo"
    collect: str = "0 */3 * * *"
    cleanup_days: int = 30


class OutputConfig(BaseModel):
    drafts_dir: str = "data/drafts"
    collected_dir: str = "data/collected"
    filename_template: str = "{date}-{slug}"


class AppConfig(BaseModel):
    topic: TopicConfig = Field(default_factory=TopicConfig)
    sources: list[SourceConfig] = Field(default_factory=list)
    schedule: ScheduleConfig = Field(default_factory=ScheduleConfig)
    output: OutputConfig = Field(default_factory=OutputConfig)
    log_level: str = "INFO"
    data_dir: str = "data"

    @field_validator("sources")
    @classmethod
    def sources_have_unique_ids(cls, v: list[SourceConfig]) -> list[SourceConfig]:
        ids = [s.id for s in v]
        if len(ids) != len(set(ids)):
            raise ValueError("source IDは一意でなければなりません")
        return v

    def enabled_sources(self) -> list[SourceConfig]:
        return [s for s in self.sources if s.enabled]


def load_config(path: str | Path | None = None) -> AppConfig:
    if path is None:
        path = os.environ.get("AUTOCONTENT_CONFIG", "config/default.yaml")
    path = Path(path)
    if not path.exists():
        return AppConfig()
    with open(path, encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    return AppConfig.model_validate(data)
