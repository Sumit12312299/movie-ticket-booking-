import pytest
from app.utils.code_generator import generate_booking_code, generate_invoice_number
from app.utils.security_utils import validate_password_strength, sanitize_search_query

def test_generate_booking_code():
    code = generate_booking_code("BK")
    assert code.startswith("BK-")
    assert len(code) == 9

def test_generate_invoice_number():
    inv = generate_invoice_number()
    assert inv.startswith("INV-")

def test_validate_password_strength():
    valid, msg = validate_password_strength("StrongPass123")
    assert valid is True

    invalid, msg = validate_password_strength("weak")
    assert invalid is False

def test_sanitize_search_query():
    clean = sanitize_search_query("Inception <script>alert(1)</script>")
    assert "<" not in clean
    assert clean == "Inception scriptalert1script"
