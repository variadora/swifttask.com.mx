"""Backend tests for SWIFT TASK contact + admin endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
API = f"{BASE_URL.rstrip('/')}/api"
ADMIN_PASSWORD = "SwiftTask2026!"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(client):
    r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


# ---------- Health ----------
def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


# ---------- Admin login ----------
def test_admin_login_wrong_password(client):
    r = client.post(f"{API}/admin/login", json={"password": "wrong-pw"})
    assert r.status_code == 401


def test_admin_login_correct(client):
    r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200
    data = r.json()
    assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
    assert data.get("token_type") == "bearer"


# ---------- Admin messages protected ----------
def test_admin_messages_no_auth(client):
    r = requests.get(f"{API}/admin/messages")
    assert r.status_code == 401


def test_admin_messages_bad_token(client):
    r = requests.get(f"{API}/admin/messages", headers={"Authorization": "Bearer not.a.token"})
    assert r.status_code == 401


def test_admin_messages_with_auth(client, admin_token):
    r = requests.get(f"{API}/admin/messages", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)


# ---------- Contact create + email trigger ----------
def test_create_contact_valid_and_persists(client, admin_token):
    payload = {
        "name": "TEST_User Ana",
        "email": "delivered@resend.dev",
        "company": "TEST Corp",
        "service": "Infraestructura",
        "message": "Hola, necesito consultoria de infraestructura."
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert "id" in data and data["id"]
    # Verify via admin listing
    r2 = requests.get(f"{API}/admin/messages", headers={"Authorization": f"Bearer {admin_token}"})
    assert r2.status_code == 200
    ids = [m["id"] for m in r2.json()]
    assert data["id"] in ids


def test_admin_messages_newest_first(client, admin_token):
    p1 = {"name": "TEST_First", "email": "delivered@resend.dev", "message": "Primer mensaje de prueba"}
    p2 = {"name": "TEST_Second", "email": "delivered@resend.dev", "message": "Segundo mensaje de prueba"}
    r1 = client.post(f"{API}/contact", json=p1); assert r1.status_code == 200
    r2 = client.post(f"{API}/contact", json=p2); assert r2.status_code == 200
    listing = requests.get(f"{API}/admin/messages", headers={"Authorization": f"Bearer {admin_token}"}).json()
    ids_in_order = [m["id"] for m in listing]
    assert ids_in_order.index(r2.json()["id"]) < ids_in_order.index(r1.json()["id"])


# ---------- Validation ----------
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
