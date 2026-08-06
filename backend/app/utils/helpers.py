from datetime import datetime

def format_datetime(dt: datetime) -> str:
    """
    Formats datetime object to standard format.
    Standard pattern used: YYYY-MM-DD HH:MM:SS
    """
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def parse_datetime(dt_str: str) -> datetime:
    """Parses standard string representation to datetime object."""
    return datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
