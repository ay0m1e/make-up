"""Unit tests for booking business logic."""
from __future__ import annotations

from datetime import date, time
from types import SimpleNamespace
from uuid import uuid4

import pytest

from app.services.booking_service import BookingService
from app.services.error_handlers import ApiError


class _FakeResult:
    def __init__(self, value):
        self._value = value

    def scalar_one(self):
        return self._value

    def scalar_one_or_none(self):
        return self._value


class _OverlapSession:
    """Minimal session stub for overlap checks."""

    def __init__(self, existing_booking_id=None):
        self.existing_booking_id = existing_booking_id

    def execute(self, _stmt, *_args, **_kwargs):
        return _FakeResult(self.existing_booking_id)


class _ReferenceSession:
    """Minimal session stub for reference generation tests."""

    def __init__(self):
        self.current_max_by_year: dict[int, int] = {}
        self.lock_calls: list[tuple[int, int]] = []

    def execute(self, stmt, params=None, *_args, **_kwargs):
        text = str(stmt)
        params = params or {}

        if "pg_advisory_xact_lock" in text:
            self.lock_calls.append((int(params["namespace"]), int(params["year"])))
            return _FakeResult(1)

        if "split_part(reference_code" in text:
            prefix_like = str(params["prefix_like"])
            year = int(prefix_like.split("-")[1])
            return _FakeResult(self.current_max_by_year.get(year, 0))

        raise AssertionError(f"Unexpected SQL executed in test: {text}")

    def persist_generated_reference(self, reference_code: str) -> None:
        year = int(reference_code.split("-")[1])
        seq = int(reference_code.split("-")[2])
        self.current_max_by_year[year] = max(self.current_max_by_year.get(year, 0), seq)


def test_deposit_calculation_uses_floor_for_odd_total():
    service = SimpleNamespace(price_pence=3333)

    total, deposit = BookingService._calculate_amounts(service, quantity=3)

    assert total == 9999
    assert deposit == 4999


def test_double_booking_rejection_when_overlap_exists():
    session = _OverlapSession(existing_booking_id=uuid4())
    booking_service = BookingService(session=session)

    with pytest.raises(ApiError) as exc_info:
        booking_service._ensure_no_overlap(
            booking_date=date(2026, 2, 26),
            start_time=time(10, 0),
            end_time=time(11, 0),
        )

    error = exc_info.value
    assert error.code == "double_booking"
    assert error.status_code == 409


def test_reference_code_generation_is_unique_when_sequence_advances():
    session = _ReferenceSession()
    booking_service = BookingService(session=session)

    first = booking_service._generate_reference_code(2026)
    session.persist_generated_reference(first)  # Simulate booking insert using the generated code.
    second = booking_service._generate_reference_code(2026)

    assert first == "GLM-2026-0001"
    assert second == "GLM-2026-0002"
    assert first != second
    assert session.lock_calls == [(7319, 2026), (7319, 2026)]
