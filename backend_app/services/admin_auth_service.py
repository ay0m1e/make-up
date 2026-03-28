"""Admin authentication helpers."""
from __future__ import annotations

from typing import Any
from uuid import UUID

import sqlalchemy as sa
from flask import jsonify
from flask_jwt_extended import JWTManager
from sqlalchemy.orm import Session
from werkzeug.security import check_password_hash, generate_password_hash

from backend_app.extensions import db
from backend_app.models import Admin
from backend_app.services.error_handlers import ApiError


class AdminAuthService:
    """Service object for admin authentication and admin account setup."""

    def __init__(self, session=None) -> None:
        self.session = session or db.session

    def authenticate(self, *, email: str, password: str) -> Admin:
        normalized_email = self.normalize_email(email)
        if not normalized_email or not isinstance(password, str) or not password:
            raise self._invalid_credentials()

        stmt = sa.select(Admin).where(Admin.email == normalized_email).limit(1)
        admin = self.session.execute(stmt).scalar_one_or_none()

        if admin is None or not admin.is_active:
            raise self._invalid_credentials()
        if not check_password_hash(admin.password_hash, password):
            raise self._invalid_credentials()

        return admin

    def create_admin(
        self,
        *,
        email: str,
        password: str,
        full_name: str | None = None,
    ) -> Admin:
        normalized_email = self.normalize_email(email)
        if not normalized_email:
            raise ApiError(
                message="email must be a non-empty string.",
                status_code=400,
                code="invalid_admin_email",
            )
        if not isinstance(password, str) or not password:
            raise ApiError(
                message="password must be a non-empty string.",
                status_code=400,
                code="invalid_admin_password",
            )

        existing = self.session.execute(
            sa.select(Admin).where(Admin.email == normalized_email).limit(1),
        ).scalar_one_or_none()
        if existing is not None:
            raise ApiError(
                message="Admin already exists.",
                status_code=409,
                code="admin_exists",
            )

        admin = Admin(
            email=normalized_email,
            password_hash=generate_password_hash(password),
            full_name=self._normalize_optional_text(full_name),
            is_active=True,
        )
        self.session.add(admin)
        self.session.commit()
        self.session.refresh(admin)
        return admin

    @staticmethod
    def normalize_email(email: Any) -> str:
        if not isinstance(email, str):
            return ""
        return email.strip().lower()

    @staticmethod
    def serialize_admin(admin: Admin) -> dict[str, str | None]:
        return {
            "id": str(admin.id),
            "email": admin.email,
            "full_name": admin.full_name,
        }

    @staticmethod
    def _normalize_optional_text(value: Any) -> str | None:
        if value is None:
            return None
        if not isinstance(value, str):
            raise ApiError(
                message="name must be a string.",
                status_code=400,
                code="invalid_admin_name",
            )
        cleaned = value.strip()
        return cleaned or None

    @staticmethod
    def _invalid_credentials() -> ApiError:
        return ApiError(
            message="Invalid credentials",
            status_code=401,
            code="invalid_credentials",
        )


def register_jwt_callbacks(jwt_manager: JWTManager) -> None:
    """Register JWT callbacks for consistent JSON errors and admin lookup."""

    @jwt_manager.unauthorized_loader
    def handle_missing_token(reason: str):
        return jsonify({
            "error": "authorization_required",
            "message": "Authentication required.",
        }), 401

    @jwt_manager.invalid_token_loader
    def handle_invalid_token(reason: str):
        return jsonify({
            "error": "invalid_token",
            "message": "Invalid token.",
        }), 401

    @jwt_manager.expired_token_loader
    def handle_expired_token(_jwt_header: dict[str, Any], _jwt_payload: dict[str, Any]):
        return jsonify({
            "error": "token_expired",
            "message": "Token has expired.",
        }), 401

    @jwt_manager.user_lookup_loader
    def load_admin(_jwt_header: dict[str, Any], jwt_data: dict[str, Any]):
        identity = jwt_data.get("sub")
        try:
            admin_id = UUID(str(identity))
        except (TypeError, ValueError):
            return None

        # Use an isolated session here so JWT auth does not open an implicit
        # transaction on the request-scoped db.session before route handlers run.
        with Session(db.engine) as session:
            admin = session.get(Admin, admin_id)
            if admin is None or not admin.is_active:
                return None

            return {
                "id": str(admin.id),
                "email": admin.email,
                "full_name": admin.full_name,
            }

    @jwt_manager.user_lookup_error_loader
    def handle_missing_admin(_jwt_header: dict[str, Any], _jwt_payload: dict[str, Any]):
        return jsonify({
            "error": "invalid_token",
            "message": "Invalid token.",
        }), 401
