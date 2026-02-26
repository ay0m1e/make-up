"""Booking business logic service."""
from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import Any
from uuid import UUID

import sqlalchemy as sa
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Booking, Service
from app.services.error_handlers import ApiError


ACTIVE_BOOKING_STATUSES = ("pending", "confirmed")
ACTIVE_PAYMENT_STATUSES = ("awaiting_transfer", "deposit_paid")
_REFERENCE_LOCK_NAMESPACE = 7319


class BookingService:
    """Service object for booking validation and creation."""

    def __init__(self, session=None) -> None:
        self.session = session or db.session

    def create_booking(
        self,
        *,
        service_id: str | UUID,
        customer_name: str,
        customer_email: str,
        customer_phone: str,
        booking_date: date,
        start_time: time,
        quantity: int = 1,
        notes: str | None = None,
    ) -> dict[str, Any]:
        if quantity < 1:
            raise ApiError(
                message="Quantity must be at least 1.",
                status_code=400,
                code="invalid_quantity",
            )

        service_uuid = self._parse_uuid(service_id, field_name="service_id")

        # Use a savepoint when called inside an existing transaction so booking
        # creation remains atomic without rolling back unrelated outer work.
        tx = self.session.begin() if not self.session.in_transaction() else self.session.begin_nested()

        try:
            with tx:
                service = self._get_active_service(service_uuid)
                total_amount_pence, deposit_amount_pence = self._calculate_amounts(service, quantity)
                end_time = self._compute_end_time(
                    booking_date=booking_date,
                    start_time=start_time,
                    duration_minutes=service.duration_minutes,
                    quantity=quantity,
                )

                self._ensure_no_overlap(
                    booking_date=booking_date,
                    start_time=start_time,
                    end_time=end_time,
                )

                reference_code = self._generate_reference_code(booking_date.year)

                booking = Booking(
                    reference_code=reference_code,
                    service_id=service.id,
                    customer_name=customer_name,
                    customer_email=customer_email,
                    customer_phone=customer_phone,
                    booking_date=booking_date,
                    start_time=start_time,
                    end_time=end_time,
                    quantity=quantity,
                    total_amount_pence=total_amount_pence,
                    deposit_amount_pence=deposit_amount_pence,
                    booking_status="pending",
                    payment_method="bank_transfer",
                    payment_status="awaiting_transfer",
                    notes=notes,
                )

                self.session.add(booking)
                self.session.flush()
                self.session.refresh(booking)

                return self._serialize_booking(booking)
        except IntegrityError as error:
            raise ApiError(
                message="Unable to create booking due to a database conflict.",
                status_code=409,
                code="booking_conflict",
            ) from error

    def list_bookings(
        self,
        *,
        status: str | None = None,
        date_from: date | None = None,
        date_to: date | None = None,
        page: int = 1,
        per_page: int = 20,
    ) -> dict[str, Any]:
        if page < 1:
            raise ApiError(
                message="page must be greater than or equal to 1.",
                status_code=400,
                code="invalid_pagination",
            )
        if per_page < 1:
            raise ApiError(
                message="per_page must be greater than 0.",
                status_code=400,
                code="invalid_pagination",
            )
        if per_page > 100:
            raise ApiError(
                message="per_page must be less than or equal to 100.",
                status_code=400,
                code="invalid_pagination",
            )

        stmt = sa.select(Booking).options(sa.orm.selectinload(Booking.service))
        count_stmt = sa.select(sa.func.count()).select_from(Booking)

        if status:
            stmt = stmt.where(Booking.booking_status == status)
            count_stmt = count_stmt.where(Booking.booking_status == status)
        if date_from:
            stmt = stmt.where(Booking.booking_date >= date_from)
            count_stmt = count_stmt.where(Booking.booking_date >= date_from)
        if date_to:
            stmt = stmt.where(Booking.booking_date <= date_to)
            count_stmt = count_stmt.where(Booking.booking_date <= date_to)

        total = int(self.session.execute(count_stmt).scalar_one())

        stmt = (
            stmt.order_by(
                Booking.booking_date.desc(),
                Booking.start_time.desc(),
                Booking.created_at.desc(),
            )
            .limit(per_page)
            .offset((page - 1) * per_page)
        )
        rows = self.session.execute(stmt).scalars().all()

        return {
            "items": [self._serialize_booking(booking) for booking in rows],
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "pages": (total + per_page - 1) // per_page if total else 0,
            },
            "filters": {
                "status": status,
                "date_from": date_from.isoformat() if date_from else None,
                "date_to": date_to.isoformat() if date_to else None,
            },
        }

    def confirm_deposit(self, booking_id: str | UUID) -> dict[str, Any]:
        booking_uuid = self._parse_uuid(booking_id, field_name="booking_id")
        tx = self.session.begin() if not self.session.in_transaction() else self.session.begin_nested()

        with tx:
            booking = self._get_booking_for_update(booking_uuid)

            if booking.booking_status == "cancelled":
                raise ApiError(
                    message="Cancelled bookings cannot be confirmed.",
                    status_code=409,
                    code="invalid_booking_transition",
                )
            if booking.booking_status not in ACTIVE_BOOKING_STATUSES:
                raise ApiError(
                    message="Booking cannot be confirmed from its current status.",
                    status_code=409,
                    code="invalid_booking_transition",
                    details={"booking_status": booking.booking_status},
                )
            if booking.payment_status != "awaiting_transfer":
                raise ApiError(
                    message="Deposit can only be confirmed from awaiting_transfer state.",
                    status_code=409,
                    code="invalid_payment_transition",
                    details={"payment_status": booking.payment_status},
                )

            booking.payment_status = "deposit_paid"
            booking.booking_status = "confirmed"

            self.session.flush()
            self.session.refresh(booking)
            return self._serialize_booking(booking)

    def cancel_booking(self, booking_id: str | UUID) -> dict[str, Any]:
        booking_uuid = self._parse_uuid(booking_id, field_name="booking_id")
        tx = self.session.begin() if not self.session.in_transaction() else self.session.begin_nested()

        with tx:
            booking = self._get_booking_for_update(booking_uuid)

            if booking.booking_status == "cancelled":
                raise ApiError(
                    message="Booking is already cancelled.",
                    status_code=409,
                    code="invalid_booking_transition",
                    details={"booking_status": booking.booking_status},
                )
            if booking.booking_status not in ACTIVE_BOOKING_STATUSES:
                raise ApiError(
                    message="Booking cannot be cancelled from its current status.",
                    status_code=409,
                    code="invalid_booking_transition",
                    details={"booking_status": booking.booking_status},
                )

            booking.booking_status = "cancelled"

            self.session.flush()
            self.session.refresh(booking)
            return self._serialize_booking(booking)

    def _get_active_service(self, service_id: UUID) -> Service:
        service = self.session.get(Service, service_id)
        if service is None:
            raise ApiError(
                message="Service not found.",
                status_code=404,
                code="service_not_found",
            )
        if not service.is_active:
            raise ApiError(
                message="Service is not available for booking.",
                status_code=400,
                code="service_inactive",
            )
        return service

    def _get_booking_for_update(self, booking_id: UUID) -> Booking:
        stmt = (
            sa.select(Booking)
            .options(sa.orm.selectinload(Booking.service))
            .where(Booking.id == booking_id)
            .with_for_update()
        )
        booking = self.session.execute(stmt).scalar_one_or_none()
        if booking is None:
            raise ApiError(
                message="Booking not found.",
                status_code=404,
                code="booking_not_found",
            )
        return booking

    @staticmethod
    def _calculate_amounts(service: Service, quantity: int) -> tuple[int, int]:
        total = service.price_pence * quantity
        deposit = total // 2
        return total, deposit

    @staticmethod
    def _compute_end_time(
        *,
        booking_date: date,
        start_time: time,
        duration_minutes: int,
        quantity: int,
    ) -> time:
        start_dt = datetime.combine(booking_date, start_time)
        end_dt = start_dt + timedelta(minutes=duration_minutes * quantity)

        if end_dt.date() != booking_date:
            raise ApiError(
                message="Booking duration exceeds the same-day schedule.",
                status_code=400,
                code="invalid_time_range",
            )

        return end_dt.time()

    def _ensure_no_overlap(self, *, booking_date: date, start_time: time, end_time: time) -> None:
        overlap_stmt = (
            sa.select(Booking.id)
            .where(Booking.booking_date == booking_date)
            .where(Booking.start_time < end_time)
            .where(Booking.end_time > start_time)
            .where(Booking.booking_status.in_(ACTIVE_BOOKING_STATUSES))
            .where(Booking.payment_status.in_(ACTIVE_PAYMENT_STATUSES))
            .limit(1)
        )

        existing_booking_id = self.session.execute(overlap_stmt).scalar_one_or_none()
        if existing_booking_id is not None:
            raise ApiError(
                message="This time slot is no longer available.",
                status_code=409,
                code="double_booking",
                details={"booking_date": booking_date.isoformat()},
            )

    def _generate_reference_code(self, year: int) -> str:
        self.session.execute(
            sa.text("SELECT pg_advisory_xact_lock(:namespace, :year)"),
            {"namespace": _REFERENCE_LOCK_NAMESPACE, "year": year},
        )

        prefix = f"GLM-{year}-"
        next_seq_stmt = sa.text(
            """
            SELECT COALESCE(MAX(CAST(split_part(reference_code, '-', 3) AS INTEGER)), 0)
            FROM bookings
            WHERE reference_code LIKE :prefix_like
            """
        )
        current_max = self.session.execute(
            next_seq_stmt,
            {"prefix_like": f"{prefix}%"},
        ).scalar_one()
        next_number = int(current_max) + 1
        return f"{prefix}{next_number:04d}"

    @staticmethod
    def _parse_uuid(value: str | UUID, *, field_name: str) -> UUID:
        if isinstance(value, UUID):
            return value
        try:
            return UUID(str(value))
        except (TypeError, ValueError) as error:
            raise ApiError(
                message=f"Invalid {field_name}.",
                status_code=400,
                code="invalid_uuid",
                details={"field": field_name},
            ) from error

    @staticmethod
    def _serialize_booking(booking: Booking) -> dict[str, Any]:
        return {
            "id": str(booking.id),
            "reference_code": booking.reference_code,
            "service": {
                "id": str(booking.service.id) if booking.service and booking.service.id else None,
                "name": booking.service.name if booking.service else None,
            },
            "customer": {
                "name": booking.customer_name,
                "email": booking.customer_email,
                "phone": booking.customer_phone,
            },
            "booking_date": booking.booking_date.isoformat(),
            "start_time": booking.start_time.isoformat(),
            "end_time": booking.end_time.isoformat(),
            "quantity": booking.quantity,
            "amounts": {
                "total_amount_pence": booking.total_amount_pence,
                "deposit_amount_pence": booking.deposit_amount_pence,
            },
            "booking_status": booking.booking_status,
            "payment_method": booking.payment_method,
            "payment_status": booking.payment_status,
            "notes": booking.notes,
            "created_at": booking.created_at.isoformat() if booking.created_at else None,
        }
