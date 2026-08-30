from __future__ import annotations
import re
import unicodedata

def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

def unique_slug(base: str, existing: set) -> str:
    slug    = base
    counter = 2
    while slug in existing:
        slug    = f"{base}-{counter}"
        counter += 1
    return slug
