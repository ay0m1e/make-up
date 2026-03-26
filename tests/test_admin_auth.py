"""Tests for admin authentication and admin route protection."""
from __future__ import annotations

from dataclasses import dataclass
from uuid import uuid4

import pytest
from werkzeug.security import generate_password_hash

from backend_app import create_app
from backend_app.config import TestingConfig
from backend_app.services.admin_auth_service import AdminAuthService
from backend_app.services.error_handlers import ApiError


@dataclass
class _FakeAdmin:
    id: object
    email: str
    password_hash: str
    is_active: bool = True
    full_name: str | None = None


class _FakeResult:
    def __init__(self, value):
        self._value = value

    def scalar_one_or_none(self):
        return self._value


class _FakeSession:
    def __init__(self, admin=None):
        self.admin = admin

    def execute(self, _stmt, *_args, **_kwargs):
        return _FakeResult(self.admin)


@pytest.fixture()
def app():
    class _AuthTestingConfig(TestingConfig):
        JWT_SECRET_KEY = "test-jwt-secret"
        SECRET_KEY = "test-secret"

    app = create_app(_AuthTestingConfig)
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_successful_login_returns_access_token(client, monkeypatch):
    admin = _FakeAdmin(
        id=uuid4(),
        email="admin@example.com",
        password_hash="unused",
        full_name="Admin User",
    )

    def fake_authenticate(self, *, email: str, password: str):
        assert email == "ADMIN@EXAMPLE.COM"
        assert password == "secret123"
        return admin

    monkeypatch.setattr(AdminAuthService, "authenticate", fake_authenticate)

    response = client.post(
        "/api/admin/login",
        json={"email": "ADMIN@EXAMPLE.COM", "password": "secret123"},
    )

    assert response.status_code == 200
    payload = response.get_json()
    assert isinstance(payload["access_token"], str)
    assert payload["admin"] == {
        "id": str(admin.id),
        "email": admin.email,
        "full_name": admin.full_name,
    }


def test_invalid_password_returns_invalid_credentials():
    admin = _FakeAdmin(
        id=uuid4(),
        email="admin@example.com",
        password_hash=generate_password_hash("correct-password"),
        is_active=True,
    )
    service = AdminAuthService(session=_FakeSession(admin=admin))

    with pytest.raises(ApiError) as exc_info:
        service.authenticate(email="admin@example.com", password="wrong-password")

    error = exc_info.value
    assert error.status_code == 401
    assert error.message == "Invalid credentials"
    assert error.code == "invalid_credentials"


def test_inactive_admin_is_blocked():
    admin = _FakeAdmin(
        id=uuid4(),
        email="admin@example.com",
        password_hash=generate_password_hash("secret123"),
        is_active=False,
    )
    service = AdminAuthService(session=_FakeSession(admin=admin))

    with pytest.raises(ApiError) as exc_info:
        service.authenticate(email="admin@example.com", password="secret123")

    error = exc_info.value
    assert error.status_code == 401
    assert error.message == "Invalid credentials"
    assert error.code == "invalid_credentials"


def test_protected_admin_route_requires_token(client):
    response = client.get("/api/admin/bookings")

    assert response.status_code == 401
    payload = response.get_json()
    assert payload["error"] == "authorization_required"
