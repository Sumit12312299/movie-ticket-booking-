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

