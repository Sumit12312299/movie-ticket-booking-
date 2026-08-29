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





def is_valid_email(email: Optional[str]) -> bool:
    """
    Validates whether the given string is a properly formatted email address.

    Args:
        email (Optional[str]): The email string to validate.

    Returns:
        bool: True if valid email format, False otherwise.
    """
    import re
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(pattern, email.strip()))

def truncate_text(text: Optional[str], max_length: int = 100) -> str:
    """
    Truncates a string to the specified max length, appending ellipsis if needed.

    Args:
        text (Optional[str]): Input string to truncate.
        max_length (int): Maximum allowed length. Defaults to 100.

    Returns:
        str: Truncated string with ellipsis, or original if within limit.
    """
    if not text:
        return ""
    if len(text) <= max_length:
        return text
    return text[:max_length].rstrip() + "..."

def slugify(text: Optional[str]) -> str:
    """
    Converts a string to a URL-friendly slug (lowercase, hyphen-separated).

    Args:
        text (Optional[str]): Input string to slugify.

    Returns:
        str: URL-safe slug string.
    """
    import re
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text

def capitalize_words(text: Optional[str]) -> str:
    """
    Capitalizes the first letter of each word in the given string.

    Args:
        text (Optional[str]): Input string.

    Returns:
        str: Title-cased string.
    """
    if not text:
        return ""
    return text.strip().title()

def get_greeting() -> str:
    """
    Returns a time-based greeting string (Morning, Afternoon, Evening).

    Returns:
        str: Appropriate greeting based on current server time.
    """
    from datetime import datetime
    hour = datetime.now().hour
    if hour < 12:
        return "Good Morning"
    elif hour < 17:
        return "Good Afternoon"
    else:
        return "Good Evening"
