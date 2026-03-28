"""Environment-aware Flask configuration."""
import os

from dotenv import load_dotenv

load_dotenv(override=False)


def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _get_runtime_env_name() -> str:
    return (os.getenv("APP_ENV") or os.getenv("FLASK_ENV") or "development").lower()


def _get_cors_origins() -> list[str]:
    explicit_origins = _split_csv(os.getenv("CORS_ALLOWED_ORIGINS"))
    if explicit_origins:
        return explicit_origins

    frontend_origin = os.getenv("FRONTEND_ORIGIN", "").strip()
    origins: list[str] = [frontend_origin] if frontend_origin else []

    if _get_runtime_env_name() != "production":
        origins.extend(
            [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ]
        )

    return origins


def _normalise_database_url(url: str | None) -> str | None:
    if not url:
        return None
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    if url.startswith("postgresql://") and not url.startswith("postgresql+psycopg2://"):
        return url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    SQLALCHEMY_DATABASE_URI = _normalise_database_url(os.getenv("DATABASE_URL"))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }
    JSON_SORT_KEYS = False
    PROPAGATE_EXCEPTIONS = False
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    JWT_TOKEN_LOCATION = ["headers"]
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN")
    CORS_ALLOWED_ORIGINS = _get_cors_origins()
    EMAIL_API_BASE_URL = os.getenv("EMAIL_API_BASE_URL", "https://api.resend.com/emails")
    EMAIL_API_KEY = os.getenv("EMAIL_API_KEY") or os.getenv("RESEND_API_KEY")
    FROM_EMAIL = os.getenv("FROM_EMAIL")
    BANK_ACCOUNT_NAME = os.getenv("BANK_ACCOUNT_NAME")
    BANK_SORT_CODE = os.getenv("BANK_SORT_CODE")
    BANK_ACCOUNT_NUMBER = os.getenv("BANK_ACCOUNT_NUMBER")
    BANK_REFERENCE_PREFIX = os.getenv("BANK_REFERENCE_PREFIX")


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv("TEST_DATABASE_URL", "sqlite+pysqlite:///:memory:")


class ProductionConfig(BaseConfig):
    DEBUG = False
    TESTING = False


CONFIG_MAP: dict[str, type[BaseConfig]] = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config_class() -> type[BaseConfig]:
    env_name = os.getenv("APP_ENV") or os.getenv("FLASK_ENV") or "development"
    return CONFIG_MAP.get(env_name.lower(), DevelopmentConfig)
