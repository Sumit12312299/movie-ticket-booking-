from datetime import datetime
from typing import Optional

def format_datetime(dt: Optional[datetime]) -> str:
    """
    Formats datetime object to standard format.
    Standard pattern used: YYYY-MM-DD HH:MM:SS.
    Returns empty string if datetime object is None.
    """
    if dt is None:
        return ""
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def parse_datetime(dt_str: Optional[str]) -> Optional[datetime]:
    """
    Parses standard string representation to datetime object.
    Returns None if parsed string is empty, invalid, or None.
    """
    if not dt_str:
        return None
    try:
        return datetime.strptime(dt_str.strip(), "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None
