"""
Unit tests for BookTicket backend helper utility functions.
"""
from datetime import datetime
from app.utils.helpers import format_datetime, parse_datetime, format_currency

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
