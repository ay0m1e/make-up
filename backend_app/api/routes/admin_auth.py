"""Admin authentication routes."""
from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from backend_app.services import AdminAuthService
from backend_app.services.error_handlers import ApiError


admin_auth_bp = Blueprint("admin_auth", __name__, url_prefix="/api/admin")


@admin_auth_bp.post("/login")
def admin_login():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise ApiError(
            message="Request body must be a JSON object.",
            status_code=400,
            code="invalid_json",
        )

    email = payload.get("email")
    password = payload.get("password")

    admin = AdminAuthService().authenticate(
        email=email,
        password=password,
    )
    access_token = create_access_token(
        identity=str(admin.id),
        additional_claims={"role": "admin"},
    )

    return jsonify({
        "access_token": access_token,
        "admin": AdminAuthService.serialize_admin(admin),
    })
