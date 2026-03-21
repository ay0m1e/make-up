"""Structured logging configuration."""
from __future__ import annotations

import json
import logging
import sys
from datetime import datetime, timezone
from time import perf_counter
from typing import Any

from flask import Flask, g, request


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        for key in (
            "http_method",
            "path",
            "status_code",
            "duration_ms",
            "remote_addr",
            "request_id",
        ):
            value = getattr(record, key, None)
            if value is not None:
                payload[key] = value

        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)

        return json.dumps(payload, ensure_ascii=True)



def configure_logging(app: Flask) -> None:
    level_name = str(app.config.get("LOG_LEVEL", "INFO")).upper()
    level = getattr(logging, level_name, logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    handler.setLevel(level)

    app.logger.handlers = [handler]
    app.logger.setLevel(level)
    app.logger.propagate = False

    werkzeug_logger = logging.getLogger("werkzeug")
    werkzeug_logger.handlers = [handler]
    werkzeug_logger.setLevel(level)
    werkzeug_logger.propagate = False

    @app.before_request
    def _request_timer_start() -> None:
        g._request_started_at = perf_counter()

    @app.after_request
    def _log_response(response):
        started_at = getattr(g, "_request_started_at", None)
        duration_ms = round((perf_counter() - started_at) * 1000, 2) if started_at else None

        app.logger.info(
            "request_completed",
            extra={
                "http_method": request.method,
                "path": request.path,
                "status_code": response.status_code,
                "duration_ms": duration_ms,
                "remote_addr": request.headers.get("X-Forwarded-For", request.remote_addr),
                "request_id": request.headers.get("X-Request-Id"),
            },
        )
        return response
