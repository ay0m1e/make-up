"""Centralised error handling."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException


@dataclass(slots=True)
class ApiError(Exception):
    message: str
    status_code: int = 400
    code: str = "bad_request"
    details: dict[str, Any] = field(default_factory=dict)



def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def handle_api_error(error: ApiError):
        payload = {
            "error": error.code,
            "message": error.message,
        }
        if error.details:
            payload["details"] = error.details
        return jsonify(payload), error.status_code

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        payload = {
            "error": error.name.lower().replace(" ", "_"),
            "message": error.description,
        }
        return jsonify(payload), error.code or 500

    @app.errorhandler(Exception)
    def handle_unexpected_error(error: Exception):
        app.logger.exception("unhandled_exception")
        return (
            jsonify({
                "error": "internal_server_error",
                "message": "An unexpected error occurred.",
            }),
            500,
        )
