#!/usr/bin/env python3
"""Add the indexable case-study collection and static articles to sitemap.xml."""

from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parents[1]
START = "  <!-- CASE STUDIES START -->"
END = "  <!-- CASE STUDIES END -->"


def main() -> None:
    path = ROOT / "sitemap.xml"
    source = path.read_text(encoding="utf-8")
    source = re.sub(
        rf"\n{re.escape(START)}.*?{re.escape(END)}\n",
        "\n",
        source,
        flags=re.DOTALL,
    )

    data_source = (ROOT / "js" / "case-studies-data.js").read_text(encoding="utf-8")
    match = re.search(r"window\.SOANCE_CASE_STUDIES=(\[.*\]);\s*$", data_source, re.DOTALL)
    if not match:
        raise RuntimeError("Could not parse js/case-studies-data.js")
    studies = json.loads(match.group(1))

    urls = [
        "  <url>\n"
        "    <loc>https://www.soance.com/case-studies.html</loc>\n"
        "    <lastmod>2026-07-14</lastmod>\n"
        "    <changefreq>monthly</changefreq>\n"
        "    <priority>0.8</priority>\n"
        "  </url>"
    ]
    urls.extend(
        "  <url>\n"
        f"    <loc>https://www.soance.com/case-studies/{study['slug']}.html</loc>\n"
        "    <lastmod>2026-07-14</lastmod>\n"
        "    <changefreq>monthly</changefreq>\n"
        "    <priority>0.7</priority>\n"
        "  </url>"
        for study in studies
    )

    block = f"{START}\n" + "\n".join(urls) + f"\n{END}"
    source = source.replace("</urlset>", f"{block}\n</urlset>")

    path.write_text(source, encoding="utf-8")
    print(f"Added {len(urls)} indexable case-study URLs to {path}")


if __name__ == "__main__":
    main()
