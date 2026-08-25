#!/usr/bin/env python3
"""Add the Case Studies destination to shared static headers and footers."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
SKIP = {"case-studies.html", "case-study.html"}


def add_after(lines: list[str], pattern: re.Pattern[str], replacement: str) -> list[str]:
    output: list[str] = []
    for index, line in enumerate(lines):
        output.append(line)
        if not pattern.search(line):
            continue
        nearby = "".join(lines[index + 1:index + 4])
        if "case-studies.html" in nearby:
            continue
        indent = line[: len(line) - len(line.lstrip())]
        output.append(indent + replacement + "\n")
    return output


def update_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    lines = original.splitlines(keepends=True)

    lines = add_after(
        lines,
        re.compile(r'<li(?:\s+class="[^"]+")?><a href="about\.html">ABOUT</a></li>'),
        '<li><a href="case-studies.html">CASE STUDIES</a></li>',
    )
    lines = add_after(
        lines,
        re.compile(r'<li(?:\s+class="[^"]+")?><a href="about\.html">About</a></li>'),
        '<li><a href="case-studies.html">Case Studies</a></li>',
    )
    lines = add_after(
        lines,
        re.compile(r'<a href="about\.html" class="hover:text-slate-900">About</a>'),
        '<a href="case-studies.html" class="hover:text-slate-900">Case Studies</a>',
    )

    output: list[str] = []
    for index, line in enumerate(lines):
        if '<a href="/privacy.html">Privacy policy</a>' in line:
            nearby = "".join(lines[max(0, index - 3):index])
            if "case-studies.html" not in nearby:
                indent = line[: len(line) - len(line.lstrip())]
                output.append(indent + '<a href="/case-studies.html">Case Studies</a>\n')
        output.append(line)

    updated = "".join(output)
    if updated == original:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed = []
    for path in sorted(ROOT.glob("*.html")):
        if path.name in SKIP:
            continue
        if update_file(path):
            changed.append(path.name)
    print(f"Updated {len(changed)} HTML files")
    for name in changed:
        print(name)


if __name__ == "__main__":
    main()
