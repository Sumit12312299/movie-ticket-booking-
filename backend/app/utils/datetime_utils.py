from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

def format_iso(dt: Optional[datetime]) -> Optional[str]:
    if dt is None:
        return None
    return dt.isoformat()

def parse_iso(dt_str: str) -> Optional[datetime]:
    try:
        return datetime.fromisoformat(dt_str)
    except (ValueError, TypeError):
        return None
