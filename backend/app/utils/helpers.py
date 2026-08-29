# General utility helpers
"""
BookTicket Utility Helpers.
Provides date/time formatting and parsing utilities for backend API endpoints.
"""
from datetime import datetime
from typing import Optional

def format_datetime(dt: Optional[datetime]) -> str:
    """
    Formats a datetime object to a standard string representation.

    Args:
        dt (Optional[datetime]): The datetime object to format.

    Returns:
        str: Standard pattern formatted string 'YYYY-MM-DD HH:MM:SS',
             or an empty string if input dt is None.
    """
    if dt is None:
        return ""
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def parse_datetime(dt_str: Optional[str]) -> Optional[datetime]:
    """
    Parses a standard string representation back into a datetime object.

    Args:
        dt_str (Optional[str]): Standard formatted date string 'YYYY-MM-DD HH:MM:SS'.

    Returns:
        Optional[datetime]: Parsed datetime object, or None if the input
                            string is empty, invalid, or None.
    """
    if not dt_str:
        return None
    try:
        return datetime.strptime(dt_str.strip(), "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None

def format_currency(amount: float) -> str:
    """
    Formats a numeric amount as currency string (INR).

    Args:
        amount (float): The numeric amount to format.

    Returns:
        str: Formatted currency string with rupee symbol (e.g. ₹150.00).
    """
    return f"₹{amount:,.2f}"

def sanitize_string(input_str: Optional[str]) -> str:
    """
    Strips raw HTML tags and surrounding whitespace from string input.

    Args:
        input_str (Optional[str]): Unsanitized raw string.

    Returns:
        str: Cleaned string with HTML stripped.
    """
    import re
    if not input_str:
        return ""
    clean = re.sub(r'<[^>]*>', '', input_str)
    return clean.strip()

def format_duration_mins(minutes: int) -> str:
    """
    Formats integer minutes into a formatted display string (e.g. 150 -> '2h 30m').

    Args:
        minutes (int): Duration in minutes.

    Returns:
        str: Formatted duration string.
    """
    if not isinstance(minutes, int) or minutes <= 0:
        return "0m"
    hours = minutes // 60
    rem_mins = minutes % 60
    if hours == 0:
        return f"{rem_mins}m"
    if rem_mins == 0:
        return f"{hours}h"
    return f"{hours}h {rem_mins}m"




