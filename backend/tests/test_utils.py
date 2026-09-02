import pytest
from app.utils.validator_utils import is_valid_email, is_valid_phone, is_valid_booking_ref
from app.utils.file_utils import sanitize_filename, get_file_extension

def test_is_valid_email():
    assert is_valid_email("user@example.com") is True
    assert is_valid_email("invalid-email") is False

def test_is_valid_phone():
    assert is_valid_phone("9876543210") is True
    assert is_valid_phone("12345") is False

def test_is_valid_booking_ref():
    assert is_valid_booking_ref("BOOK1234") is True
    assert is_valid_booking_ref("SHORT") is False

def test_sanitize_filename():
    assert sanitize_filename("my file/poster.png") == "poster.png"
    assert sanitize_filename("test@file!.jpg") == "test_file_.jpg"

def test_get_file_extension():
    assert get_file_extension("movie_poster.JPEG") == "jpeg"
