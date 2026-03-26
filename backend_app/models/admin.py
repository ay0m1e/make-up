"""Admin model."""
from __future__ import annotations

from uuid import uuid4

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from backend_app.extensions import db


class Admin(db.Model):
    __tablename__ = "admins"

    id = sa.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        server_default=sa.text("gen_random_uuid()"),
    )
    email = sa.Column(sa.Text, nullable=False, unique=True)
    password_hash = sa.Column(sa.Text, nullable=False)
    full_name = sa.Column(sa.Text, nullable=True)
    is_active = sa.Column(sa.Boolean, nullable=False, default=True, server_default=sa.true())
    created_at = sa.Column(
        sa.DateTime,
        nullable=False,
        server_default=sa.text("NOW()"),
    )
