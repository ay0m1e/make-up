"""Environment-aware Flask configuration."""
import os

from dotenv import load_dotenv

load_dotenv()


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
