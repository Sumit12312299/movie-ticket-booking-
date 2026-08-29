"""
Pytest configuration and shared fixtures for BookTicket backend tests.
"""
import pytest


@pytest.fixture
def sample_movie():
    """Returns a basic movie data dictionary for testing."""
    return {
        "title": "Avengers: Infinity War",
        "genre": "Action",
        "duration_mins": 149,
        "language": "English",
        "rating": 8.4,
    }


@pytest.fixture
def sample_user():
    """Returns a sample user payload for auth testing."""
    return {
        "email": "testuser@example.com",
        "full_name": "Test User",
        "phone": "9876543210",
    }
