"""Health check and temporary diagnostics routes."""
import sqlalchemy as sa
from flask import Blueprint, current_app, jsonify

from backend_app.extensions import db


health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health():
    return jsonify({"status": "ok"}), 200


@health_bp.get("/db-check")
def db_check():
    try:
        db.session.execute(sa.text("SELECT 1")).scalar_one()
        return jsonify({"database": "connected"}), 200
    except Exception as exc:  # pragma: no cover - temporary diagnostic route
        current_app.logger.exception("db_check_failed")
        return jsonify({"error": str(exc)}), 500
