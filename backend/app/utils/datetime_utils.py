from datetime import datetime, timezone
from typing import Optional

def get_utc_now() -> datetime:
    """Return timezone-aware current UTC datetime."""
    return datetime.now(timezone.utc)

def format_iso_timestamp(dt: Optional[datetime] = None) -> str:
    """Format a datetime to standard ISO 8601 string."""
    dt = dt or get_utc_now()
    return dt.isoformat()

def is_show_time_in_future(start_time: datetime) -> bool:
    """Check if show start time is in the future."""
    now = get_utc_now()
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=timezone.utc)
    return start_time > now
