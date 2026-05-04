from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Generator


SCHEMA_VERSION = 1

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS schema_version (
    version    INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    guid         TEXT NOT NULL UNIQUE,
    source_id    TEXT NOT NULL,
    source_type  TEXT NOT NULL,
    url          TEXT NOT NULL,
    title        TEXT,
    content      TEXT,
    author       TEXT,
    published_at TEXT,
    collected_at TEXT NOT NULL DEFAULT (datetime('now')),
    content_hash TEXT NOT NULL,
    word_count   INTEGER DEFAULT 0,
    score        REAL DEFAULT 0.0,
    status       TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_articles_source_id  ON articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_status      ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_collected_at ON articles(collected_at);

CREATE TABLE IF NOT EXISTS drafts (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    body          TEXT NOT NULL,
    source_ids    TEXT NOT NULL DEFAULT '[]',
    template_used TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    status        TEXT NOT NULL DEFAULT 'draft',
    output_path   TEXT
);

CREATE INDEX IF NOT EXISTS idx_drafts_status     ON drafts(status);
CREATE INDEX IF NOT EXISTS idx_drafts_created_at ON drafts(created_at);
"""


@dataclass
class Article:
    guid: str
    source_id: str
    source_type: str
    url: str
    title: str = ""
    content: str = ""
    author: str = ""
    published_at: str = ""
    content_hash: str = ""
    word_count: int = 0
    score: float = 0.0
    status: str = "new"
    id: int = 0
    collected_at: str = ""


@dataclass
class Draft:
    title: str
    body: str
    template_used: str
    source_ids: list[int] = field(default_factory=list)
    status: str = "draft"
    output_path: str = ""
    id: int = 0
    created_at: str = ""


class Storage:
    def __init__(self, db_path: str | Path) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_schema()

    @contextmanager
    def _conn(self) -> Generator[sqlite3.Connection, None, None]:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def _init_schema(self) -> None:
        with self._conn() as conn:
            conn.executescript(SCHEMA_SQL)
            row = conn.execute("SELECT version FROM schema_version ORDER BY version DESC LIMIT 1").fetchone()
            if row is None:
                conn.execute("INSERT INTO schema_version (version) VALUES (?)", (SCHEMA_VERSION,))

    # ── Articles ──────────────────────────────────────────────

    def upsert_article(self, article: Article) -> bool:
        """Insert or ignore (by guid). Returns True if inserted."""
        with self._conn() as conn:
            cur = conn.execute(
                """
                INSERT OR IGNORE INTO articles
                    (guid, source_id, source_type, url, title, content, author,
                     published_at, content_hash, word_count, score, status)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    article.guid, article.source_id, article.source_type,
                    article.url, article.title, article.content, article.author,
                    article.published_at, article.content_hash,
                    article.word_count, article.score, article.status,
                ),
            )
            return cur.rowcount > 0

    def get_new_articles(self, limit: int = 50) -> list[Article]:
        with self._conn() as conn:
            rows = conn.execute(
                "SELECT * FROM articles WHERE status = 'new' ORDER BY collected_at DESC LIMIT ?",
                (limit,),
            ).fetchall()
        return [self._row_to_article(r) for r in rows]

    def get_recent_articles(self, limit: int = 50, days: int = 7) -> list[Article]:
        with self._conn() as conn:
            rows = conn.execute(
                """
                SELECT * FROM articles
                WHERE collected_at >= datetime('now', ?)
                ORDER BY score DESC, collected_at DESC
                LIMIT ?
                """,
                (f"-{days} days", limit),
            ).fetchall()
        return [self._row_to_article(r) for r in rows]

    def mark_article_formatted(self, article_id: int) -> None:
        with self._conn() as conn:
            conn.execute("UPDATE articles SET status = 'formatted' WHERE id = ?", (article_id,))

    def count_articles(self) -> dict[str, int]:
        with self._conn() as conn:
            rows = conn.execute("SELECT status, COUNT(*) as n FROM articles GROUP BY status").fetchall()
        return {r["status"]: r["n"] for r in rows}

    def guid_exists(self, guid: str) -> bool:
        with self._conn() as conn:
            row = conn.execute("SELECT 1 FROM articles WHERE guid = ?", (guid,)).fetchone()
        return row is not None

    # ── Drafts ────────────────────────────────────────────────

    def save_draft(self, draft: Draft) -> int:
        with self._conn() as conn:
            cur = conn.execute(
                """
                INSERT INTO drafts (title, body, source_ids, template_used, status, output_path)
                VALUES (?,?,?,?,?,?)
                """,
                (
                    draft.title, draft.body,
                    json.dumps(draft.source_ids, ensure_ascii=False),
                    draft.template_used, draft.status, draft.output_path,
                ),
            )
            return cur.lastrowid  # type: ignore[return-value]

    def get_drafts(self, status: str | None = None, limit: int = 50) -> list[Draft]:
        with self._conn() as conn:
            if status:
                rows = conn.execute(
                    "SELECT * FROM drafts WHERE status = ? ORDER BY created_at DESC LIMIT ?",
                    (status, limit),
                ).fetchall()
            else:
                rows = conn.execute(
                    "SELECT * FROM drafts ORDER BY created_at DESC LIMIT ?", (limit,)
                ).fetchall()
        return [self._row_to_draft(r) for r in rows]

    def count_drafts(self) -> dict[str, int]:
        with self._conn() as conn:
            rows = conn.execute("SELECT status, COUNT(*) as n FROM drafts GROUP BY status").fetchall()
        return {r["status"]: r["n"] for r in rows}

    # ── Helpers ───────────────────────────────────────────────

    @staticmethod
    def _row_to_article(row: sqlite3.Row) -> Article:
        return Article(
            id=row["id"],
            guid=row["guid"],
            source_id=row["source_id"],
            source_type=row["source_type"],
            url=row["url"],
            title=row["title"] or "",
            content=row["content"] or "",
            author=row["author"] or "",
            published_at=row["published_at"] or "",
            collected_at=row["collected_at"] or "",
            content_hash=row["content_hash"],
            word_count=row["word_count"] or 0,
            score=row["score"] or 0.0,
            status=row["status"],
        )

    @staticmethod
    def _row_to_draft(row: sqlite3.Row) -> Draft:
        return Draft(
            id=row["id"],
            title=row["title"],
            body=row["body"],
            source_ids=json.loads(row["source_ids"] or "[]"),
            template_used=row["template_used"],
            created_at=row["created_at"] or "",
            status=row["status"],
            output_path=row["output_path"] or "",
        )
