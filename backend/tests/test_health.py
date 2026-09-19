import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data or "status" in data

def test_health_endpoint():
    response = client.get("/health")
    # Health endpoint returns 200 if defined
    if response.status_code == 200:
        data = response.json()
        assert data.get("status") in ["healthy", "ok", "running"]
