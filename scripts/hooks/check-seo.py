"""SEO check for Posts (pre-commit hook).

  - title 20–60 characters (search results cut longer titles)
  - description 50–160 characters (used for <meta name="description"> and link previews)
  - exactly one category (this blog files each Post under one; there are no tags)

Drafts are skipped. usage: check-seo.py <content/blog/<slug>/index.md>...
"""
import sys
from pathlib import Path

import yaml

LIMITS = {"title": (20, 60), "description": (50, 160)}


def main() -> int:
    failed = 0
    for name in sys.argv[1:]:
        text = Path(name).read_text(encoding="utf-8")
        fm = yaml.safe_load(text.split("\n---", 1)[0].removeprefix("---\n")) or {}
        if fm.get("draft"):
            continue
        problems = []
        for key, (lo, hi) in LIMITS.items():
            value = str(fm.get(key) or "").strip()
            if not value:
                problems.append(f"missing {key}")
            elif not lo <= len(value) <= hi:
                problems.append(f"{key} is {len(value)} chars, keep it {lo}–{hi}")
        if len(fm.get("categories") or []) != 1:
            problems.append("needs exactly one category")
        for p in problems:
            print(f"{name}: SEO: {p}")
        failed |= bool(problems)
    return int(failed)


if __name__ == "__main__":
    sys.exit(main())
