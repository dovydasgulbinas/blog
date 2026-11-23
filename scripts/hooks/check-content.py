"""Content validation for Hugo page bundles (pre-commit hook).

Checks every Markdown file it is given:
  - front matter is valid YAML with a title
  - Posts (content/blog/<slug>/index.md): a date and exactly one known category
  - files named in front matter (cover, js, css, track) exist in the bundle
  - Markdown images have alt text; relative image/link targets exist in the bundle

usage: check-content.py <hugo.toml> <file.md>...
"""
import re
import sys
import tomllib
from pathlib import Path

import yaml

BUNDLE_KEYS = ("cover", "js", "css", "track")
IMAGE = re.compile(r"!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\s*\)")
LINK = re.compile(r"(?<!!)\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\s*\)")
FENCE = re.compile(r"^(```|~~~).*?^\1", re.M | re.S)


def front_matter(text: str):
    if not text.startswith("---\n"):
        raise ValueError("no YAML front matter (must start with ---)")
    end = text.find("\n---", 4)
    if end < 0:
        raise ValueError("front matter is not closed with ---")
    return yaml.safe_load(text[4:end]) or {}, text[end + 4 :]


def is_local(target: str) -> bool:
    return not re.match(r"^([a-z][a-z0-9+.-]*:|/|#|\{)", target, re.I)


def check(path: Path, categories: set[str]) -> list[str]:
    errors = []
    try:
        fm, body = front_matter(path.read_text(encoding="utf-8"))
    except (ValueError, yaml.YAMLError) as e:
        return [str(e)]

    if not str(fm.get("title", "")).strip():
        errors.append("missing title")

    is_post = path.parts[:2] == ("content", "blog") and path.name == "index.md"
    if is_post:
        if not fm.get("date"):
            errors.append("missing date")
        cats = fm.get("categories") or []
        if len(cats) != 1:
            errors.append(f"needs exactly one category, has {cats or 'none'}")
        elif cats[0] not in categories:
            errors.append(f"unknown category {cats[0]!r}; add it to params.categories in hugo.toml or use one of {sorted(categories)}")

    bundle = path.parent if path.name == "index.md" else None
    for key in BUNDLE_KEYS:
        if fm.get(key) and bundle and not (bundle / str(fm[key])).is_file():
            errors.append(f"{key}: {fm[key]!r} is not a file in {bundle}")

    prose = FENCE.sub("", body)
    for alt, target in IMAGE.findall(prose):
        if not alt.strip():
            errors.append(f"image {target!r} has no alt text")
        if bundle and is_local(target) and not (bundle / target.split("#")[0]).is_file():
            errors.append(f"image {target!r} is not in the bundle")
    for target in LINK.findall(prose):
        file = target.split("#")[0].split("?")[0]
        if bundle and file and is_local(target) and "." in Path(file).name and not (bundle / file).is_file():
            errors.append(f"link {target!r} points to a missing bundle file")
    return errors


def main() -> int:
    config = tomllib.loads(Path(sys.argv[1]).read_text())
    categories = set(config.get("params", {}).get("categories", {}))
    failed = 0
    for name in sys.argv[2:]:
        for err in check(Path(name), categories):
            print(f"{name}: {err}")
            failed = 1
    return failed


if __name__ == "__main__":
    sys.exit(main())
