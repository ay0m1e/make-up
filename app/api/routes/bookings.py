"""Booking API routes."""
from __future__ import annotations

from datetime import date as dt_date
from datetime import time as dt_time
from typing import Any

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required

from app.services import BookingService
from app.services.error_handlers import ApiError


bookings_bp = Blueprint("bookings", __name__, url_prefix="/api")

_REQUIRED_FIELDS = (
    "service_id",
    "booking_date",
    "start_time",
    "quantity",
    "customer_name",
    "customer_email",
    "customer_phone",
)


@bookings_bp.post("/bookings")
def create_booking():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise ApiError(
            message="Request body must be a JSON object.",
            status_code=400,
            code="invalid_json",
        )

    _validate_required_fields(payload)

    booking_data = BookingService().create_booking(
        service_id=payload["service_id"],
        booking_date=_parse_date(payload["booking_date"], field_name="booking_date"),
        start_time=_parse_time(payload["start_time"], field_name="start_time"),
        quantity=_parse_quantity(payload["quantity"]),
        customer_name=_require_text(payload["customer_name"], field_name="customer_name"),
        customer_email=_require_text(payload["customer_email"], field_name="customer_email"),
        customer_phone=_require_text(payload["customer_phone"], field_name="customer_phone"),
        notes=_optional_text(payload.get("notes")),
    )

    bank_transfer = _get_bank_transfer_details(booking_data["reference_code"])

    response = {
        "booking_id": booking_data["id"],
        "reference_code": booking_data["reference_code"],
        "booking_status": booking_data["booking_status"],
        "payment_status": booking_data["payment_status"],
        "total_amount_pence": booking_data["amounts"]["total_amount_pence"],
        "deposit_amount_pence": booking_data["amounts"]["deposit_amount_pence"],
        "bank_transfer": bank_transfer,
    }
    return jsonify(response), 201


@bookings_bp.get("/admin/bookings")
@jwt_required()
def list_admin_bookings():
    status = request.args.get("status", type=str)
    date_from_raw = request.args.get("date_from", type=str)
    date_to_raw = request.args.get("date_to", type=str)
    page = _parse_pagination_value(request.args.get("page", default=1), field_name="page", default=1)
    per_page = _parse_pagination_value(
        request.args.get("per_page", default=20),
        field_name="per_page",
        default=20,
    )

    date_from = _parse_date(date_from_raw, field_name="date_from") if date_from_raw else None
    date_to = _parse_date(date_to_raw, field_name="date_to") if date_to_raw else None

    if date_from and date_to and date_from > date_to:
        raise ApiError(
            message="date_from must be on or before date_to.",
            status_code=400,
            code="invalid_date_range",
        )

    result = BookingService().list_bookings(
        status=status.strip() if isinstance(status, str) and status.strip() else None,
        date_from=date_from,
        date_to=date_to,
        page=page,
        per_page=per_page,
    )
    return _json_response(data=result["items"], meta={**result["pagination"], "filters": result["filters"]})


@bookings_bp.patch("/admin/bookings/<booking_id>/confirm-deposit")
@jwt_required()
def confirm_booking_deposit(booking_id: str):
    booking = BookingService().confirm_deposit(booking_id)
    return _json_response(data=booking)


@bookings_bp.patch("/admin/bookings/<booking_id>/cancel")
@jwt_required()
def cancel_booking(booking_id: str):
    booking = BookingService().cancel_booking(booking_id)
    return _json_response(data=booking)


def _validate_required_fields(payload: dict[str, Any]) -> None:
    missing = [field for field in _REQUIRED_FIELDS if field not in payload]
    if missing:
        raise ApiError(
            message="Missing required fields.",
            status_code=400,
            code="missing_fields",
            details={"fields": missing},
        )


def _parse_pagination_value(value: Any, *, field_name: str, default: int) -> int:
    if value in (None, ""):
        return default
    if isinstance(value, bool):
        raise ApiError(
            message=f"{field_name} must be an integer.",
            status_code=400,
            code="invalid_pagination",
            details={"field": field_name},
        )
    try:
        return int(value)
    except (TypeError, ValueError) as error:
        raise ApiError(
            message=f"{field_name} must be an integer.",
            status_code=400,
            code="invalid_pagination",
            details={"field": field_name},
        ) from error


def _require_text(value: Any, *, field_name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ApiError(
            message=f"{field_name} must be a non-empty string.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        )
    return value.strip()


def _optional_text(value: Any) -> str | None:
    if value is None:
        return None
    if not isinstance(value, str):
        raise ApiError(
            message="notes must be a string.",
            status_code=400,
            code="invalid_field",
            details={"field": "notes"},
        )
    text = value.strip()
    return text or None


def _parse_quantity(value: Any) -> int:
    if isinstance(value, bool):
        raise ApiError(
            message="quantity must be an integer.",
            status_code=400,
            code="invalid_quantity",
        )
    try:
        quantity = int(value)
    except (TypeError, ValueError) as error:
        raise ApiError(
            message="quantity must be an integer.",
            status_code=400,
            code="invalid_quantity",
        ) from error
    return quantity


def _parse_date(value: Any, *, field_name: str) -> dt_date:
    if not isinstance(value, str):
        raise ApiError(
            message=f"{field_name} must be a date string in YYYY-MM-DD format.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        )
    try:
        return dt_date.fromisoformat(value)
    except ValueError as error:
        raise ApiError(
            message=f"{field_name} must be a date string in YYYY-MM-DD format.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        ) from error


def _parse_time(value: Any, *, field_name: str) -> dt_time:
    if not isinstance(value, str):
        raise ApiError(
            message=f"{field_name} must be a time string in HH:MM or HH:MM:SS format.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        )
    try:
        parsed = dt_time.fromisoformat(value)
    except ValueError as error:
        raise ApiError(
            message=f"{field_name} must be a time string in HH:MM or HH:MM:SS format.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        ) from error

    if parsed.tzinfo is not None:
        raise ApiError(
            message=f"{field_name} must not include a timezone offset.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        )
    return parsed


def _get_bank_transfer_details(booking_reference_code: str) -> dict[str, str]:
    account_name = current_app.config.get("BANK_ACCOUNT_NAME")
    sort_code = current_app.config.get("BANK_SORT_CODE")
    account_number = current_app.config.get("BANK_ACCOUNT_NUMBER")
    reference_prefix = current_app.config.get("BANK_REFERENCE_PREFIX")

    missing = [
        key
        for key, value in (
            ("BANK_ACCOUNT_NAME", account_name),
            ("BANK_SORT_CODE", sort_code),
            ("BANK_ACCOUNT_NUMBER", account_number),
            ("BANK_REFERENCE_PREFIX", reference_prefix),
        )
        if not value
    ]
    if missing:
        raise ApiError(
            message="Bank transfer settings are not configured.",
            status_code=500,
            code="bank_transfer_config_missing",
            details={"missing": missing},
        )

    instructions = (
        "Transfer the deposit to the bank account above and use a payment reference "
        f"starting with {reference_prefix}. Include booking code {booking_reference_code}."
    )

    return {
        "account_name": str(account_name),
        "sort_code": str(sort_code),
        "account_number": str(account_number),
        "instructions": instructions,
    }


def _json_response(*, data: Any, status: int = 200, meta: dict[str, Any] | None = None):
    payload: dict[str, Any] = {"data": data}
    if meta is not None:
        payload["meta"] = meta
    return jsonify(payload), status
