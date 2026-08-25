#!/usr/bin/env python3
"""Build the local Soance case-study dataset from an approved source export.

The source JSON and browser-downloaded asset maps are staging inputs. The
generated site never hotlinks the source website.
"""

from __future__ import annotations

import argparse
import html
import json
import math
import re
import shutil
from pathlib import Path
from urllib.parse import urlparse


BRAND_PATTERN = re.compile(
    r"\b(?:diginnovators|diginovators|diginnovatos)\b", re.IGNORECASE
)
DROP_BLOCKS = re.compile(
    r"<(script|style|iframe|form|noscript)\b[^>]*>.*?</\1\s*>",
    re.IGNORECASE | re.DOTALL,
)
IMG_TAG = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
ATTR = re.compile(
    r"([:\w-]+)\s*=\s*(?:\"([^\"]*)\"|'([^']*)'|([^\s>]+))",
    re.IGNORECASE,
)
ANCHOR_HREF = re.compile(
    r"(<a\b[^>]*?\bhref\s*=\s*)([\"'])(.*?)(\2)",
    re.IGNORECASE | re.DOTALL,
)


def soance_brand(value: str) -> str:
    value = BRAND_PATTERN.sub("Soance", value)
    value = value.replace("hello@soance.com", "info@soance.com")
    return value


def soance_slug(value: str) -> str:
    return BRAND_PATTERN.sub("soance", value).lower()


def text_only(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    value = soance_brand(value)
    return re.sub(r"\s+", " ", value).strip(" \n\t[…]\u2026")


def case_excerpt(content: str, fallback: str) -> str:
    summary = re.search(
        r'<h[2-4]\b[^>]*(?:id="h-summary-tldr")?[^>]*>.*?summary.*?</h[2-4]>\s*<p\b[^>]*>(.*?)</p>',
        content,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not summary:
        summary = re.search(r"<p\b[^>]*>(.*?)</p>", content, flags=re.IGNORECASE | re.DOTALL)
    value = text_only(summary.group(1) if summary else fallback)
    if not value:
        for paragraph in re.findall(
            r"<p\b[^>]*>(.*?)</p>", content, flags=re.IGNORECASE | re.DOTALL
        ):
            candidate = text_only(paragraph)
            if candidate and not candidate.lower().startswith("get in touch"):
                value = candidate
                break
    value = re.sub(r"^summary\s*/\s*tldr\s*", "", value, flags=re.IGNORECASE)
    if len(value) <= 190:
        return value
    shortened = value[:191].rsplit(" ", 1)[0].rstrip(" ,;:-")
    return shortened + "…"


def attributes(tag: str) -> dict[str, str]:
    found: dict[str, str] = {}
    for match in ATTR.finditer(tag):
        found[match.group(1).lower()] = next(
            (part for part in match.groups()[1:] if part is not None), ""
        )
    return found


def rewrite_link(url: str) -> str:
    parsed = urlparse(html.unescape(url))
    host = parsed.netloc.lower()
    path = parsed.path or "/"

    if host and "diginnovators.com" not in host:
        return url
    if not host and not path.startswith("/"):
        return url
    if path.startswith("/case-studies/"):
        parts = [part for part in path.split("/") if part]
        if len(parts) >= 2:
            return f"case-study.html?case={soance_slug(parts[-1])}"
        return "case-studies.html"
    if path in ("/case-studies", "/case-studies/"):
        return "case-studies.html"
    if "contact" in path or "connect-" in path:
        return "contact.html"
    if path.startswith("/about"):
        return "about.html"
    if path in ("", "/"):
        return "/"
    return "contact.html"


def sanitize_content(
    raw: str,
    main_image: str | None,
    profile_urls: dict[str, str],
) -> str:
    value = DROP_BLOCKS.sub("", raw)
    value = re.sub(r"<!--.*?-->", "", value, flags=re.DOTALL)
    value = re.sub(
        r"\s+on[a-z]+\s*=\s*(?:\"[^\"]*\"|'[^']*'|[^\s>]+)",
        "",
        value,
        flags=re.IGNORECASE,
    )

    def image_tag(match: re.Match[str]) -> str:
        attrs = attributes(match.group(0))
        candidates = [
            attrs.get("data-lazy-src", ""),
            attrs.get("data-src", ""),
            attrs.get("src", ""),
        ]
        source = next(
            (candidate for candidate in candidates if candidate.startswith("http")), ""
        )
        local = profile_urls.get(source) or main_image
        if not local:
            return ""
        alt = soance_brand(attrs.get("alt", "")).strip()
        class_name = "case-study-portrait" if source in profile_urls else "case-study-source-image"
        return (
            f'<img src="{html.escape(local, quote=True)}" '
            f'alt="{html.escape(alt, quote=True)}" '
            f'class="{class_name}" loading="lazy">'
        )

    value = IMG_TAG.sub(image_tag, value)

    def anchor(match: re.Match[str]) -> str:
        url = rewrite_link(match.group(3))
        return f'{match.group(1)}"{html.escape(url, quote=True)}"'

    value = ANCHOR_HREF.sub(anchor, value)
    value = re.sub(r"\s+(?:srcset|sizes|data-[\w-]+)=([\"']).*?\1", "", value, flags=re.I)
    value = soance_brand(value)
    value = value.replace("https://www.soance.com", "")
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def copy_asset(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-json", required=True, type=Path)
    parser.add_argument("--asset-map", required=True, type=Path)
    parser.add_argument("--profile-map", required=True, type=Path)
    parser.add_argument("--project-root", required=True, type=Path)
    parser.add_argument("--compressed-dir", type=Path)
    args = parser.parse_args()

    posts = json.loads(args.source_json.read_text(encoding="utf-8"))
    asset_map = json.loads(args.asset_map.read_text(encoding="utf-8"))
    profile_assets = json.loads(args.profile_map.read_text(encoding="utf-8"))

    image_dir = args.project_root / "images" / "case-studies"
    image_dir.mkdir(parents=True, exist_ok=True)

    profile_urls: dict[str, str] = {}
    for asset in profile_assets:
        source = Path(asset["path"])
        compressed = (
            args.compressed_dir / "profiles" / f'{Path(asset["name"]).stem}.webp'
            if args.compressed_dir
            else None
        )
        if compressed and compressed.exists():
            source = compressed
        suffix = source.suffix.lower() or ".jpg"
        destination = image_dir / "profiles" / f'{Path(asset["name"]).stem}{suffix}'
        copy_asset(source, destination)
        profile_urls[asset["url"]] = destination.relative_to(args.project_root).as_posix()

    banner = asset_map.get("__banner")
    if banner:
        copy_asset(Path(banner["path"]), image_dir / "banner-bg-graphic.svg")

    image_by_slug: dict[str, str | None] = {}
    for slug, asset in asset_map.items():
        if slug.startswith("__"):
            continue
        if not asset:
            image_by_slug[slug] = None
            continue
        source = Path(asset["path"])
        compressed = args.compressed_dir / f"{slug}.webp" if args.compressed_dir else None
        if compressed and compressed.exists():
            source = compressed
        suffix = source.suffix.lower() or Path(asset["name"]).suffix.lower() or ".png"
        destination = image_dir / f"{soance_slug(slug)}{suffix}"
        copy_asset(source, destination)
        image_by_slug[slug] = destination.relative_to(args.project_root).as_posix()

    records = []
    for post in posts:
        source_slug = post["slug"]
        slug = soance_slug(source_slug)
        title = soance_brand(html.unescape(post["title"]["rendered"])).strip()
        raw_content = post.get("content", {}).get("rendered", "")
        excerpt = case_excerpt(
            raw_content,
            post.get("excerpt", {}).get("rendered", ""),
        )
        main_image = image_by_slug.get(source_slug)
        content = sanitize_content(
            raw_content,
            main_image,
            profile_urls,
        )
        word_count = len(re.findall(r"\b[\w’'-]+\b", text_only(content)))
        records.append(
            {
                "slug": slug,
                "title": title,
                "excerpt": excerpt,
                "image": main_image,
                "readingMinutes": max(1, math.ceil(word_count / 250)),
                "content": content,
            }
        )

    output = args.project_root / "js" / "case-studies-data.js"
    output.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    output.write_text(
        "/* Generated from the approved case-study source export. */\n"
        f"window.SOANCE_CASE_STUDIES={payload};\n",
        encoding="utf-8",
    )
    print(f"Imported {len(records)} case studies into {output}")


if __name__ == "__main__":
    main()
