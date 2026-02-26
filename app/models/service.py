"""Service model."""
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from app.extensions import db


class Service(db.Model):
    __tablename__ = "services"

    id = sa.Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=sa.text("gen_random_uuid()"),
    )
    name = sa.Column(sa.Text, nullable=False)
    description = sa.Column(sa.Text, nullable=True)
    price_pence = sa.Column(sa.Integer, nullable=False)
    duration_minutes = sa.Column(sa.Integer, nullable=False)
    category = sa.Column(sa.Text, nullable=True)
    is_active = sa.Column(sa.Boolean, nullable=False, server_default=sa.true())
    created_at = sa.Column(sa.DateTime, nullable=False, server_default=sa.text("NOW()"))

    bookings = db.relationship("Booking", back_populates="service")
