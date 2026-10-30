#!/usr/bin/env python3
"""Check the deployable HTML and discovery files without network access."""
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from urllib.parse import unquote, urljoin, urlparse

from bs4 import BeautifulSoup
from build_seo import BASE, ROOT, NOINDEX, pages, page_url, plain

errors = []


def require(condition, message):
    if not condition:
        errors.append(message)


def walk(value):
    if isinstance(value, dict):
        yield value
        for item in value.values():
            yield from walk(item)
    elif isinstance(value, list):
        for item in value:
            yield from walk(item)


def main():
    docs = {page_url(p): (p, BeautifulSoup(p.read_text(), "html.parser")) for p in pages()}
    titles, descriptions, nodes, references = defaultdict(list), defaultdict(list), {}, []
    indexable = set()
    for url, (path, soup) in docs.items():
        rel = path.relative_to(ROOT).as_posix()
        robots = soup.select('meta[name="robots"]')
        require(len(robots) == 1, f"{rel}: expected one robots directive")
        excluded = rel in NOINDEX
        if not excluded:
            indexable.add(url)
        if robots:
            require(("noindex" in robots[0]["content"]) == excluded, f"{rel}: incorrect indexability")
        require(len(soup.find_all("title")) == 1, f"{rel}: expected one title")
        require(len(soup.find_all("h1")) == 1, f"{rel}: expected one H1")
        canonical = soup.select('link[rel="canonical"]')
        require(len(canonical) == 1 and canonical[0]["href"] == url, f"{rel}: incorrect canonical")
        viewport = soup.select_one('meta[name="viewport"]')
        require(viewport and "user-scalable=0" not in viewport["content"], f"{rel}: zoom is disabled")
        for key in ["description", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"]:
            tags = soup.find_all("meta", attrs={"name": key})
            require(len(tags) == 1 and bool(tags[0].get("content")), f"{rel}: missing or duplicate {key}")
        for key in ["og:title", "og:description", "og:url", "og:image", "og:image:alt", "og:image:width", "og:image:height"]:
            tags = soup.find_all("meta", attrs={"property": key})
            require(len(tags) == 1 and bool(tags[0].get("content")), f"{rel}: missing or duplicate {key}")
        title = plain(soup.title)
        description = soup.select_one('meta[name="description"]')["content"]
        titles[title].append(rel)
        descriptions[description].append(rel)
        require(len(description) <= 170, f"{rel}: description exceeds editorial length")
        require(soup.select_one('meta[property="og:title"]')["content"] == title, f"{rel}: social title mismatch")
        require(soup.select_one('meta[property="og:description"]')["content"] == description, f"{rel}: social description mismatch")
        for tag in soup.find_all(["a", "img", "script", "link"]):
            attr = "src" if tag.name in {"img", "script"} else "href"
            href = tag.get(attr, "")
            if not href or href.startswith(("mailto:", "tel:", "javascript:", "data:")):
                continue
            target = urlparse(urljoin(url, href))
            if target.netloc != "www.soance.com":
                continue
            local = ROOT / (unquote(target.path).lstrip("/") or "index.html")
            require(local.is_file(), f"{rel}: broken local {attr} {href}")
            if target.fragment and local.suffix == ".html" and local.is_file():
                target_doc = docs.get(BASE + target.path.lstrip("/")) if target.path != "/" else docs.get(BASE)
                if target_doc:
                    require(target_doc[1].find(id=unquote(target.fragment)) is not None, f"{rel}: broken fragment {href}")
        for img in soup.find_all("img"):
            require(img.has_attr("alt"), f"{rel}: image missing alt text")
            require(img.has_attr("width") and img.has_attr("height"), f"{rel}: image missing intrinsic dimensions: {img.get('src')}")
        require("cdn.tailwindcss.com" not in path.read_text() and "less.min.js" not in path.read_text(), f"{rel}: browser CSS compiler remains")
        scripts = soup.select('script[type="application/ld+json"]')
        require(len(scripts) == (0 if excluded else 1), f"{rel}: incorrect number of structured data blocks")
        for script in scripts:
            try:
                data = json.loads(script.string)
            except (ValueError, TypeError) as exc:
                errors.append(f"{rel}: invalid JSON-LD: {exc}")
                continue
            require(data.get("@context") == "https://schema.org", f"{rel}: missing schema context")
            graph = data.get("@graph", [])
            ids = [n.get("@id") for n in graph]
            require(len(ids) == len(set(ids)), f"{rel}: duplicate schema node IDs")
            page = next((n for n in graph if n.get("@id") == url + "#webpage"), {})
            require(page.get("name") == title and page.get("description") == description, f"{rel}: WebPage metadata mismatch")
            for node in walk(data):
                identifier = node.get("@id")
                if identifier and len(node) > 1:
                    nodes[identifier] = node
                elif identifier:
                    references.append((rel, identifier))
                if node.get("@type") == "BreadcrumbList":
                    items = node["itemListElement"]
                    require(len(items) >= 2 and [i["position"] for i in items] == list(range(1, len(items) + 1)), f"{rel}: invalid breadcrumb positions")
                if node.get("@type") == "ItemList":
                    require(node["numberOfItems"] == len(list(ROOT.glob("case-studies/*.html"))), f"{rel}: collection size mismatch")
                if node.get("@type") == "FAQPage":
                    details = soup.select("#faq details")
                    require(len(details) == len(node["mainEntity"]), f"{rel}: FAQ count mismatch")
                    for detail, question in zip(details, node["mainEntity"]):
                        require(plain(detail.find("summary")).rstrip(" ⌄") == question["name"], f"{rel}: FAQ question not visible")
                        require(" ".join(plain(p) for p in detail.find_all("p")) == question["acceptedAnswer"]["text"], f"{rel}: FAQ answer differs from visible text")
                if node.get("@type") == "Article" and "fictional" in node.get("genre", "").lower():
                    require("fictional" in description.lower(), f"{rel}: missing fictional disclosure in metadata")
                    require("fictional" in (ROOT / (rel + ".md")).read_text().lower(), f"{rel}: missing fictional disclosure in Markdown")
        if not excluded:
            alternate = soup.select_one('link[rel="alternate"][type="text/markdown"]')
            require(alternate is not None, f"{rel}: missing Markdown alternate")
    for rel, identifier in references:
        require(identifier in nodes, f"{rel}: unresolved schema reference {identifier}")
    for label, groups in [("title", titles), ("description", descriptions)]:
        for value, paths in groups.items():
            require(len(paths) == 1, f"Duplicate {label}: {paths}")
    tree = ET.parse(ROOT / "sitemap.xml")
    urls = [node.text for node in tree.findall(".//{*}loc")]
    require(len(urls) == len(set(urls)), "Duplicate sitemap URLs")
    require(set(urls) == indexable, "Sitemap differs from canonical indexable pages")
    require(BASE + "sitemap.xml" in (ROOT / "robots.txt").read_text(), "Missing sitemap in robots.txt")
    for name in ["llms.txt", "llms-full.txt"]:
        content = (ROOT / name).read_text()
        require(content.startswith("# Soance Innovations LLP"), f"{name}: missing heading")
        require("fictional" in content.lower(), f"{name}: missing case-study context")
        for link in re.findall(r"\]\((https://www\.soance\.com/[^)]+)\)", content):
            require((ROOT / urlparse(link).path.lstrip("/")).is_file(), f"{name}: broken link {link}")
    require(not re.search(r"#faq\s*\{[^}]*display\s*:\s*none", (ROOT / "css/style.css").read_text()), "FAQ content must remain visible to match its structured data")
    if errors:
        print("\n".join(sorted(set(errors))))
        sys.exit(1)
    print(f"PASS: {len(docs)} HTML pages, {len(indexable)} sitemap URLs, schema references, FAQs, metadata, local links, images and AI files.")


if __name__ == "__main__":
    main()
