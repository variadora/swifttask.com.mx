"""Backend tests for SWIFT TASK contact endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
API = f"{BASE_URL.rstrip('/')}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


def test_create_contact_valid(client):
    payload = {
        "name": "TEST_User Ana",
        "email": "test_ana@example.com",
        "company": "TEST Corp",
        "service": "Infraestructura",
        "message": "Hola, necesito consultoria."
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert data["company"] == payload["company"]
    assert data["service"] == payload["service"]
    assert data["message"] == payload["message"]
    assert "id" in data and data["id"]
    assert "created_at" in data
    # Verify via GET
    r2 = client.get(f"{API}/contact")
    assert r2.status_code == 200
    ids = [m["id"] for m in r2.json()]
    assert data["id"] in ids


def test_get_contact_sorted_desc(client):
    # Create two messages, ensure newest first
    p1 = {"name": "TEST_First", "email": "test_first@example.com", "message": "Primer mensaje"}
    p2 = {"name": "TEST_Second", "email": "test_second@example.com", "message": "Segundo mensaje"}
    r1 = client.post(f"{API}/contact", json=p1); assert r1.status_code == 200
    r2 = client.post(f"{API}/contact", json=p2); assert r2.status_code == 200
    listing = client.get(f"{API}/contact").json()
    # Find positions
    ids_in_order = [m["id"] for m in listing]
    assert ids_in_order.index(r2.json()["id"]) < ids_in_order.index(r1.json()["id"])


def test_contact_missing_name(client):
    r = client.post(f"{API}/contact", json={"email": "x@y.com", "message": "hello world"})
    assert r.status_code == 422


def test_contact_invalid_email(client):
    r = client.post(f"{API}/contact", json={"name": "TEST_Bob", "email": "not-an-email", "message": "hello world"})
    assert r.status_code == 422


def test_contact_short_message(client):
    r = client.post(f"{API}/contact", json={"name": "TEST_Bob", "email": "b@b.com", "message": "hi"})
    assert r.status_code == 422


def test_contact_short_name(client):
    r = client.post(f"{API}/contact", json={"name": "A", "email": "b@b.com", "message": "hello world"})
    assert r.status_code == 422
