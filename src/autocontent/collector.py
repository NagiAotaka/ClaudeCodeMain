from __future__ import annotations

import logging
import time
import urllib.robotparser
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup

from .config import AppConfig, SourceConfig
from .storage import Article, Storage
from .utils import compute_hash, score_article

logger = logging.getLogger(__name__)

_robots_cache: dict[str, urllib.robotparser.RobotFileParser] = {}
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# RSS/Atom 名前空間
NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "media": "http://search.yahoo.com/mrss/",
}


def _get_robots(domain: str) -> urllib.robotparser.RobotFileParser:
    if domain not in _robots_cache:
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(f"https://{domain}/robots.txt")
        try:
            rp.read()
        except Exception:
            pass
        _robots_cache[domain] = rp
    return _robots_cache[domain]


def _robots_allowed(url: str) -> bool:
    parsed = urlparse(url)
    domain = parsed.netloc
    rp = _get_robots(domain)
    try:
        return rp.can_fetch(USER_AGENT, url)
    except Exception:
        return True


def _fetch(url: str, timeout: int = 15) -> str:
    headers = {"User-Agent": USER_AGENT}
    try:
        with httpx.Client(follow_redirects=True, timeout=timeout) as client:
            resp = client.get(url, headers=headers)
            resp.raise_for_status()
            return resp.text
    except Exception as e:
        logger.warning("取得失敗 %s: %s", url, e)
        return ""


def _html_to_text(html: str) -> str:
    try:
        from readability import Document  # type: ignore[import-untyped]
        doc = Document(html)
        summary_html = doc.summary()
        soup = BeautifulSoup(summary_html, "html.parser")
        return soup.get_text(separator="\n", strip=True)
    except (ImportError, Exception):
        pass
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True)


def _strip_html(html_text: str) -> str:
    if not html_text:
        return ""
    soup = BeautifulSoup(html_text, "html.parser")
    return soup.get_text(separator=" ", strip=True)


def _xml_text(el: ET.Element | None) -> str:
    if el is None:
        return ""
    return (el.text or "").strip()


def _parse_rss(xml_text: str) -> list[dict]:
    """RSS 2.0 / Atom フィードをパースしてエントリのリストを返す"""
    entries: list[dict] = []
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as e:
        logger.warning("XML解析エラー: %s", e)
        return entries

    tag = root.tag.lower()

    # Atom feed
    if "atom" in tag or root.tag == "{http://www.w3.org/2005/Atom}feed":
        atom_ns = "http://www.w3.org/2005/Atom"
        for entry in root.findall(f"{{{atom_ns}}}entry"):
            guid = _xml_text(entry.find(f"{{{atom_ns}}}id"))
            title = _xml_text(entry.find(f"{{{atom_ns}}}title"))
            link_el = entry.find(f"{{{atom_ns}}}link[@rel='alternate']") or entry.find(f"{{{atom_ns}}}link")
            url = link_el.get("href", "") if link_el is not None else ""
            summary_el = entry.find(f"{{{atom_ns}}}summary") or entry.find(f"{{{atom_ns}}}content")
            content = _xml_text(summary_el)
            author_el = entry.find(f"{{{atom_ns}}}author/{{{atom_ns}}}name")
            author = _xml_text(author_el)
            published_el = entry.find(f"{{{atom_ns}}}published") or entry.find(f"{{{atom_ns}}}updated")
            published = _xml_text(published_el)
            entries.append({"guid": guid or url, "title": title, "url": url,
                            "content": content, "author": author, "published": published})
        return entries

    # RSS 2.0
    channel = root.find("channel") or root
    for item in channel.findall("item"):
        guid_el = item.find("guid")
        url_el = item.find("link")
        title = _xml_text(item.find("title"))
        url = _xml_text(url_el)
        guid = _xml_text(guid_el) if guid_el is not None else url
        desc = _xml_text(item.find("description"))
        encoded = item.find("{http://purl.org/rss/1.0/modules/content/}encoded")
        content = _xml_text(encoded) if encoded is not None else desc
        author_el = item.find("author") or item.find("{http://purl.org/dc/elements/1.1/}creator")
        author = _xml_text(author_el)
        pub_el = item.find("pubDate") or item.find("{http://purl.org/dc/elements/1.1/}date")
        published = _xml_text(pub_el)
        entries.append({"guid": guid or url, "title": title, "url": url,
                        "content": content, "author": author, "published": published})
    return entries


def _passes_filter(title: str, content: str, source: SourceConfig) -> bool:
    if source.content_filter is None:
        return True
    kws = source.content_filter.keywords
    if not kws:
        return True
    text = (title + " " + content).lower()
    matched = [kw for kw in kws if kw.lower() in text]
    if source.content_filter.mode == "all":
        return len(matched) == len(kws)
    return len(matched) > 0


class RSSCollector:
    def collect(self, source: SourceConfig, keywords: list[str], storage: Storage) -> int:
        logger.info("RSS収集開始: %s (%s)", source.name, source.url)
        xml_text = _fetch(source.url)
        if not xml_text:
            return 0

        entries = _parse_rss(xml_text)
        count = 0
        for entry in entries[: source.max_per_run]:
            guid = entry.get("guid") or entry.get("url", "")
            if not guid or storage.guid_exists(guid):
                continue
            title = entry.get("title", "")
            raw_content = entry.get("content", "")
            content_text = _strip_html(raw_content)

            if not _passes_filter(title, content_text, source):
                continue

            article = Article(
                guid=guid,
                source_id=source.id,
                source_type="rss",
                url=entry.get("url", ""),
                title=title,
                content=content_text,
                author=entry.get("author", ""),
                published_at=entry.get("published", ""),
                content_hash=compute_hash(content_text),
                word_count=len(content_text),
                score=score_article(title, content_text, keywords),
            )
            if storage.upsert_article(article):
                count += 1
            time.sleep(0.05)

        logger.info("RSS収集完了: %s — %d件追加", source.name, count)
        return count


class WebPageCollector:
    def collect(self, source: SourceConfig, keywords: list[str], storage: Storage) -> int:
        logger.info("Webページ収集開始: %s (%s)", source.name, source.url)
        if source.respect_robots_txt and not _robots_allowed(source.url):
            logger.warning("robots.txtにより %s はスキップされました", source.url)
            return 0

        html = _fetch(source.url)
        if not html:
            return 0

        content_text = _html_to_text(html)
        soup = BeautifulSoup(html, "html.parser")
        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else source.name

        guid = compute_hash(source.url + title)
        if storage.guid_exists(guid):
            return 0

        article = Article(
            guid=guid,
            source_id=source.id,
            source_type="web_page",
            url=source.url,
            title=title,
            content=content_text,
            content_hash=compute_hash(content_text),
            word_count=len(content_text),
            score=score_article(title, content_text, keywords),
        )
        inserted = storage.upsert_article(article)
        time.sleep(source.request_delay_seconds)
        count = 1 if inserted else 0
        logger.info("Webページ収集完了: %s — %d件追加", source.name, count)
        return count


class CollectorService:
    def __init__(self, config: AppConfig, storage: Storage) -> None:
        self.config = config
        self.storage = storage
        self._rss = RSSCollector()
        self._web = WebPageCollector()

    def run(self, source_ids: list[str] | None = None) -> dict[str, int]:
        keywords = self.config.topic.keywords
        sources = self.config.enabled_sources()
        if source_ids:
            sources = [s for s in sources if s.id in source_ids]

        results: dict[str, int] = {}
        for source in sources:
            try:
                if source.type == "rss":
                    n = self._rss.collect(source, keywords, self.storage)
                else:
                    n = self._web.collect(source, keywords, self.storage)
                results[source.id] = n
            except Exception as e:
                logger.error("収集エラー [%s]: %s", source.id, e)
                results[source.id] = 0
        return results
