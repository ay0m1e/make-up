"""Flask CLI commands."""
from __future__ import annotations

import click
import sqlalchemy as sa
from flask import Flask

from backend_app.extensions import db
from backend_app.models import Service
from backend_app.services import AdminAuthService
from backend_app.services.error_handlers import ApiError


SAMPLE_SERVICES = (
    {
        "name": "Bridal Makeup",
        "description": "Soft, timeless bridal makeup for wedding mornings.",
        "price_pence": 15000,
        "duration_minutes": 120,
        "category": "bridal",
        "is_active": True,
    },
    {
        "name": "Bridal Party Makeup",
        "description": "Professional makeup for bridesmaids and close family.",
        "price_pence": 9000,
        "duration_minutes": 75,
        "category": "bridal",
        "is_active": True,
    },
    {
        "name": "Event Glam",
        "description": "Polished makeup for events, parties, and special occasions.",
        "price_pence": 8500,
        "duration_minutes": 75,
        "category": "event",
        "is_active": True,
    },
    {
        "name": "Editorial Makeup",
        "description": "Refined editorial makeup for shoots and creative work.",
        "price_pence": 12000,
        "duration_minutes": 90,
        "category": "editorial",
        "is_active": True,
    },
    {
        "name": "Makeup Lesson",
        "description": "One-to-one lesson tailored to your routine and features.",
        "price_pence": 10000,
        "duration_minutes": 120,
        "category": "lesson",
        "is_active": True,
    },
)


def register_cli_commands(app: Flask) -> None:
    """Register custom Flask CLI commands."""

    @app.cli.command("create-admin")
    @click.option("--email", required=True, help="Admin email address.")
    @click.option("--password", required=True, help="Plain-text password to hash and store.")
    @click.option("--name", default=None, help="Optional full name.")
    def create_admin_command(email: str, password: str, name: str | None) -> None:
        """Create a single admin user."""
        try:
            admin = AdminAuthService().create_admin(
                email=email,
                password=password,
                full_name=name,
            )
        except ApiError as error:
            raise click.ClickException(error.message) from error

        app.logger.info(
            "create_admin_completed",
            extra={"admin_id": str(admin.id), "email": admin.email},
        )
        print(f"Admin created for {admin.email}.")

    @app.cli.command("seed-services")
    def seed_services_command() -> None:
        """Seed sample services (idempotent by name)."""
        created = 0
        updated = 0

        for item in SAMPLE_SERVICES:
            existing = db.session.execute(
                sa.select(Service).where(Service.name == item["name"]),
            ).scalar_one_or_none()

            if existing is None:
                db.session.add(Service(**item))
                created += 1
                continue

            for field, value in item.items():
                setattr(existing, field, value)
            updated += 1

        db.session.commit()
        app.logger.info(
            "seed_services_completed",
            extra={"created": created, "updated": updated, "count": len(SAMPLE_SERVICES)},
        )
        print(f"Seed complete. Created: {created}, Updated: {updated}.")
