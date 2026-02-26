"""Flask application factory."""
from __future__ import annotations

from flask import Flask

from app.api.routes import bookings_bp, health_bp, services_bp
from app.cli import register_cli_commands
from app.config import get_config_class
from app.extensions import db, jwt
from app.services.error_handlers import register_error_handlers
from app.services.logging_config import configure_logging

# Import models so SQLAlchemy metadata is registered.
from app import models  # noqa: F401



def create_app(config_object: str | type | None = None) -> Flask:
    app = Flask(__name__)

    if config_object is None:
        app.config.from_object(get_config_class())
    else:
        app.config.from_object(config_object)

    _validate_required_config(app)
    configure_logging(app)
    _register_extensions(app)
    _register_routes(app)
    register_cli_commands(app)
    register_error_handlers(app)

    app.logger.info("application_started")
    return app



def _validate_required_config(app: Flask) -> None:
    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        raise RuntimeError("DATABASE_URL is required.")



def _register_extensions(app: Flask) -> None:
    db.init_app(app)
    jwt.init_app(app)



def _register_routes(app: Flask) -> None:
    app.register_blueprint(health_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(services_bp)
