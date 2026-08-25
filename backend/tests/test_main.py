"""
Integration tests for BookTicket FastAPI root endpoints.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Verify that backend root index endpoint is online and responsive."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"
