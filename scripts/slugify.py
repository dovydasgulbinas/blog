#!/usr/bin/env python3
"""Turn a post title into its URL slug: `python3 scripts/slugify.py "Jeruzalė & Me: Part 2"` -> jeruzale-and-me-part-2.

Accents and apostrophes are dropped (ė -> e, it's -> its), `&` becomes "and", everything else that isn't a letter or digit becomes one dash.
"""
import re
import sys
import unicodedata

# Letters NFKD can't split into base letter + accent.
SPECIAL = str.maketrans({"ł": "l", "Ł": "L", "ø": "o", "Ø": "O", "đ": "d", "Đ": "D", "ß": "ss", "æ": "ae", "Æ": "AE", "œ": "oe", "Œ": "OE"})


def slugify(title: str) -> str:
    s = unicodedata.normalize("NFKD", title.translate(SPECIAL))
    s = re.sub(r"['’]", "", s.encode("ascii", "ignore").decode().lower()).replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


if __name__ == "__main__":
    slug = slugify(" ".join(sys.argv[1:]))
    if not slug:
        sys.exit("slugify: the title has no letters or digits to make a URL from")
    print(slug)
