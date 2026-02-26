"""Service management API routes."""
from __future__ import annotations

from typing import Any
from uuid import UUID

import sqlalchemy as sa
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models import Service
from app.services.error_handlers import ApiError


services_bp = Blueprint("services", __name__, url_prefix="/api")

_SERVICE_MUTABLE_FIELDS = {
    "name",
    "description",
    "price_pence",
    "duration_minutes",
    "category",
    "is_active",
}


@services_bp.get("/services")
def list_services():
    """Return active services with optional category/search filters."""
    category = request.args.get("category", type=str)
    search = request.args.get("search", type=str)

    stmt = sa.select(Service).where(Service.is_active.is_(True))

    category_value = category.strip() if category else ""
    if category_value:
        stmt = stmt.where(Service.category == category_value)

    if search and search.strip():
        term = f"%{search.strip()}%"
        stmt = stmt.where(
            sa.or_(
                Service.name.ilike(term),
                Service.description.ilike(term),
            ),
        )

    stmt = stmt.order_by(Service.name.asc(), Service.created_at.asc())
    services = db.session.execute(stmt).scalars().all()

    return _json_response(
        data=[_serialize_service(service) for service in services],
        meta={"count": len(services)},
    )


@services_bp.post("/admin/services")
@jwt_required()
def create_service():
    """Create a service (admin only)."""
    payload = _get_json_object()
    _reject_unknown_fields(payload, allowed_fields=_SERVICE_MUTABLE_FIELDS)

    data = _validate_service_payload(payload, partial=False)

    service = Service(**data)
    db.session.add(service)
    db.session.commit()
    db.session.refresh(service)

    return _json_response(data=_serialize_service(service), status=201)


@services_bp.patch("/admin/services/<service_id>")
@jwt_required()
def update_service(service_id: str):
    """Update a service (admin only)."""
    payload = _get_json_object()
    _reject_unknown_fields(payload, allowed_fields=_SERVICE_MUTABLE_FIELDS)

    if not payload:
        raise ApiError(
            message="Request body must include at least one field to update.",
            status_code=400,
            code="empty_patch",
        )

    service = _get_service_or_404(_parse_uuid(service_id))
    data = _validate_service_payload(payload, partial=True)

    for field, value in data.items():
        setattr(service, field, value)

    db.session.commit()
    db.session.refresh(service)

    return _json_response(data=_serialize_service(service))


@services_bp.delete("/admin/services/<service_id>")
@jwt_required()
def delete_service(service_id: str):
    """Soft delete a service by marking it inactive (admin only)."""
    service = _get_service_or_404(_parse_uuid(service_id))
    service.is_active = False

    db.session.commit()
    db.session.refresh(service)

    return _json_response(data=_serialize_service(service))


def _get_json_object() -> dict[str, Any]:
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise ApiError(
            message="Request body must be a JSON object.",
            status_code=400,
            code="invalid_json",
        )
    return payload


def _reject_unknown_fields(payload: dict[str, Any], *, allowed_fields: set[str]) -> None:
    unknown = sorted(set(payload) - allowed_fields)
    if unknown:
        raise ApiError(
            message="Request contains unsupported fields.",
            status_code=400,
            code="unknown_fields",
            details={"fields": unknown},
        )


def _validate_service_payload(payload: dict[str, Any], *, partial: bool) -> dict[str, Any]:
    cleaned: dict[str, Any] = {}

    def require(field: str) -> bool:
        return not partial or field in payload

    if require("name"):
        if "name" not in payload and not partial:
            raise _missing_field_error("name")
        if "name" in payload:
            cleaned["name"] = _validate_required_text(payload["name"], field_name="name")

    if require("description"):
        if "description" in payload:
            cleaned["description"] = _validate_optional_text(payload["description"], field_name="description")
        elif not partial:
            cleaned["description"] = None

    if require("price_pence"):
        if "price_pence" not in payload and not partial:
            raise _missing_field_error("price_pence")
        if "price_pence" in payload:
            price = _validate_int(payload["price_pence"], field_name="price_pence")
            if price < 0:
                raise ApiError(
                    message="price_pence must be greater than or equal to 0.",
                    status_code=400,
                    code="invalid_price",
                )
            cleaned["price_pence"] = price

    if require("duration_minutes"):
        if "duration_minutes" not in payload and not partial:
            raise _missing_field_error("duration_minutes")
        if "duration_minutes" in payload:
            duration = _validate_int(payload["duration_minutes"], field_name="duration_minutes")
            if duration <= 0:
                raise ApiError(
                    message="duration_minutes must be greater than 0.",
                    status_code=400,
                    code="invalid_duration",
                )
            cleaned["duration_minutes"] = duration

    if require("category"):
        if "category" in payload:
            cleaned["category"] = _validate_optional_text(payload["category"], field_name="category")
        elif not partial:
            cleaned["category"] = None

    if require("is_active") and "is_active" in payload:
        if not isinstance(payload["is_active"], bool):
            raise ApiError(
                message="is_active must be a boolean.",
                status_code=400,
                code="invalid_field",
                details={"field": "is_active"},
            )
        cleaned["is_active"] = payload["is_active"]

    if not partial:
        required_missing = {"name", "price_pence", "duration_minutes"} - set(cleaned)
        if required_missing:
            first_missing = sorted(required_missing)[0]
            raise _missing_field_error(first_missing)

    return cleaned


def _missing_field_error(field: str) -> ApiError:
    return ApiError(
        message="Missing required field.",
        status_code=400,
        code="missing_field",
        details={"field": field},
    )


def _validate_required_text(value: Any, *, field_name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ApiError(
            message=f"{field_name} must be a non-empty string.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        )
    return value.strip()


def _validate_optional_text(value: Any, *, field_name: str) -> str | None:
    if value is None:
        return None
    if not isinstance(value, str):
        raise ApiError(
            message=f"{field_name} must be a string or null.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        )
    text = value.strip()
    return text or None


def _validate_int(value: Any, *, field_name: str) -> int:
    if isinstance(value, bool):
        raise ApiError(
            message=f"{field_name} must be an integer.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        )
    try:
        return int(value)
    except (TypeError, ValueError) as error:
        raise ApiError(
            message=f"{field_name} must be an integer.",
            status_code=400,
            code="invalid_field",
            details={"field": field_name},
        ) from error


def _parse_uuid(value: str) -> UUID:
    try:
        return UUID(str(value))
    except (TypeError, ValueError) as error:
        raise ApiError(
            message="Invalid service id.",
            status_code=400,
            code="invalid_uuid",
            details={"field": "id"},
        ) from error


def _get_service_or_404(service_id: UUID) -> Service:
    service = db.session.get(Service, service_id)
    if service is None:
        raise ApiError(
            message="Service not found.",
            status_code=404,
            code="service_not_found",
        )
    return service


def _serialize_service(service: Service) -> dict[str, Any]:
    return {
        "id": str(service.id),
        "name": service.name,
        "description": service.description,
        "price_pence": service.price_pence,
        "duration_minutes": service.duration_minutes,
        "category": service.category,
        "is_active": service.is_active,
        "created_at": service.created_at.isoformat() if service.created_at else None,
    }


def _json_response(*, data: Any, status: int = 200, meta: dict[str, Any] | None = None):
    payload: dict[str, Any] = {"data": data}
    if meta is not None:
        payload["meta"] = meta
    return jsonify(payload), status
