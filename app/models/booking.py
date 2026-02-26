"""Booking model."""
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

from app.extensions import db


class Booking(db.Model):
    __tablename__ = "bookings"

    id = sa.Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=sa.text("gen_random_uuid()"),
    )
    reference_code = sa.Column(sa.Text, nullable=False, unique=True)

    service_id = sa.Column(
        UUID(as_uuid=True),
        sa.ForeignKey("services.id"),
        nullable=True,
    )

    customer_name = sa.Column(sa.Text, nullable=False)
    customer_email = sa.Column(sa.Text, nullable=False)
    customer_phone = sa.Column(sa.Text, nullable=False)

    booking_date = sa.Column(sa.Date, nullable=False)
    start_time = sa.Column(sa.Time, nullable=False)
    end_time = sa.Column(sa.Time, nullable=False)

    quantity = sa.Column(sa.Integer, nullable=False, server_default=sa.text("1"))

    total_amount_pence = sa.Column(sa.Integer, nullable=False)
    deposit_amount_pence = sa.Column(sa.Integer, nullable=False)

    booking_status = sa.Column(
        sa.Text,
        nullable=False,
        server_default=sa.text("'pending'"),
    )
    payment_method = sa.Column(
        sa.Text,
        nullable=False,
        server_default=sa.text("'bank_transfer'"),
    )
    payment_status = sa.Column(
        sa.Text,
        nullable=False,
        server_default=sa.text("'awaiting_transfer'"),
    )

    notes = sa.Column(sa.Text, nullable=True)
    created_at = sa.Column(sa.DateTime, nullable=False, server_default=sa.text("NOW()"))

    service = db.relationship("Service", back_populates="bookings")

    __table_args__ = (
        sa.Index("idx_bookings_booking_date", "booking_date"),
        sa.Index("idx_bookings_service_id", "service_id"),
        sa.Index("idx_bookings_booking_date_start_time", "booking_date", "start_time"),
    )
