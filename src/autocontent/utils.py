from __future__ import annotations

import hashlib
import logging
import re
import unicodedata
from datetime import datetime
from pathlib import Path


def setup_logging(level: str = "INFO", log_file: str | None = None) -> None:
    handlers: list[logging.Handler] = [logging.StreamHandler()]
    if log_file:
        Path(log_file).parent.mkdir(parents=True, exist_ok=True)
        handlers.append(logging.FileHandler(log_file, encoding="utf-8"))
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=handlers,
    )


def compute_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def slugify(text: str, max_length: int = 60) -> str:
    text = unicodedata.normalize("NFKC", text)
    # 英数字・ハイフン・スペース以外を削除
    text = re.sub(r"[^\w\s\-]", "", text, flags=re.UNICODE)
    text = text.strip().lower()
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:max_length].rstrip("-") or "untitled"


def today_str() -> str:
    return datetime.now().strftime("%Y-%m-%d")


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def build_filename(template: str, title: str) -> str:
    slug = slugify(title)
    date = today_str()
    return template.format(date=date, slug=slug)


def write_markdown(path: Path, frontmatter: dict, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = ["---"]
    for k, v in frontmatter.items():
        if isinstance(v, list):
            if v:
                lines.append(f"{k}:")
                for item in v:
                    lines.append(f"  - {item}")
            else:
                lines.append(f"{k}: []")
        elif isinstance(v, str) and ("\n" in v or ":" in v or v.startswith('"')):
            escaped = v.replace('"', '\\"')
            lines.append(f'{k}: "{escaped}"')
        else:
            lines.append(f"{k}: {v}")
    lines.append("---")
    lines.append("")
    lines.append(body)
    path.write_text("\n".join(lines), encoding="utf-8")


def score_article(title: str, content: str, keywords: list[str]) -> float:
    if not keywords:
        return 1.0
    text = (title + " " + content).lower()
    matched = sum(1 for kw in keywords if kw.lower() in text)
    return round(matched / len(keywords), 4)


def truncate(text: str, max_chars: int = 300) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit(" ", 1)[0] + "…"
