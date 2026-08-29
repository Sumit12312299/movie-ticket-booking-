"""
Unit tests for BookTicket backend helper utility functions.
"""
from datetime import datetime
from app.utils.helpers import (
    format_datetime,
    parse_datetime,
    format_currency,
    sanitize_string,
    format_duration_mins,
)

def test_format_currency():
    """Verify that ticket pricing is formatted correctly as INR."""
    assert format_currency(123.45) == "₹123.45"
    assert format_currency(1000) == "₹1,000.00"
    assert format_currency(0) == "₹0.00"

def test_format_datetime():
    """Verify that datetimes are correctly serialized to strings."""
    dt = datetime(2026, 8, 15, 23, 30, 0)
    assert format_datetime(dt) == "2026-08-15 23:30:00"
    assert format_datetime(None) == ""

def test_parse_datetime():
    """Verify that string formatted dates are correctly parsed back."""
    dt_str = "2026-08-15 23:30:00"
    dt = parse_datetime(dt_str)
    assert dt is not None
    assert dt.year == 2026
    assert dt.month == 8
    assert dt.day == 15
    assert parse_datetime(None) is None
    assert parse_datetime("invalid") is None

def test_sanitize_string():
    """Verify HTML stripping and trimming from string inputs."""
    assert sanitize_string("<script>alert('xss')</script>Hello") == "alert('xss')Hello"
    assert sanitize_string("  <b>Movie Title</b>  ") == "Movie Title"
    assert sanitize_string(None) == ""

def test_format_duration_mins():
    """Verify runtime duration conversion in minutes."""
    assert format_duration_mins(150) == "2h 30m"
    assert format_duration_mins(45) == "45m"
    assert format_duration_mins(120) == "2h"
    assert format_duration_mins(0) == "0m"


def test_is_valid_email_valid():
    from app.utils.helpers import is_valid_email
    assert is_valid_email("user@example.com") is True

def test_is_valid_email_invalid():
    from app.utils.helpers import is_valid_email
    assert is_valid_email("not-an-email") is False

def test_is_valid_email_none():
    from app.utils.helpers import is_valid_email
    assert is_valid_email(None) is False

def test_truncate_text_within_limit():
    from app.utils.helpers import truncate_text
    assert truncate_text("short text", 100) == "short text"

def test_truncate_text_exceeds_limit():
    from app.utils.helpers import truncate_text
    result = truncate_text("a" * 200, 100)
    assert result.endswith("...") and len(result) <= 103

def test_truncate_text_none():
    from app.utils.helpers import truncate_text
    assert truncate_text(None) == ""

def test_slugify_basic():
    from app.utils.helpers import slugify
    assert slugify("Hello World") == "hello-world"

def test_slugify_special_chars():
    from app.utils.helpers import slugify
    assert slugify("Movie & Theater!") == "movie-theater"

def test_slugify_none():
    from app.utils.helpers import slugify
    assert slugify(None) == ""
