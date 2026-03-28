"""HTTP email delivery and booking notification helpers."""
from __future__ import annotations

import json
import logging
from datetime import date, time
from typing import Any, Mapping
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from flask import current_app, has_app_context

from backend_app.services.error_handlers import ApiError


def build_bank_transfer_details(
    booking_reference_code: str,
    config: Mapping[str, Any] | None = None,
) -> dict[str, str]:
    config_map = config or current_app.config
    account_name = config_map.get("BANK_ACCOUNT_NAME")
    sort_code = config_map.get("BANK_SORT_CODE")
    account_number = config_map.get("BANK_ACCOUNT_NUMBER")
    reference_prefix = config_map.get("BANK_REFERENCE_PREFIX")

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


class EmailDeliveryError(RuntimeError):
    """Raised when the email provider API rejects or fails a request."""

    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


class EmailService:
    """Delivers plain-text booking lifecycle emails over an HTTP provider."""

    def __init__(self, config: Mapping[str, Any] | None = None, logger: logging.Logger | None = None):
        self.config = config or (current_app.config if has_app_context() else {})
        self.logger = logger or (current_app.logger if has_app_context() else logging.getLogger(__name__))

    def send_booking_received(self, booking: Mapping[str, Any]) -> None:
        self._send_customer_booking_received(booking)
        self._send_admin_booking_submitted(booking)

    def _send_customer_booking_received(self, booking: Mapping[str, Any]) -> None:
        try:
            bank_transfer = build_bank_transfer_details(booking["reference_code"], self.config)
            customer = booking["customer"]
            service = booking["service"]
            amounts = booking["amounts"]

            body = "\n".join(
                [
                    f"Hello {customer['name']},",
                    "",
                    "We have received your booking request.",
                    "",
                    f"Service: {service.get('name') or 'Selected service'}",
                    f"Date: {_format_booking_date(booking['booking_date'])}",
                    f"Time: {_format_booking_time(booking['start_time'])}",
                    f"Total amount: {_format_amount_pence(amounts['total_amount_pence'])}",
                    f"Deposit amount: {_format_amount_pence(amounts['deposit_amount_pence'])}",
                    f"Booking reference: {booking['reference_code']}",
                    "",
                    "Please send your deposit using the bank details below:",
                    f"Account name: {bank_transfer['account_name']}",
                    f"Sort code: {bank_transfer['sort_code']}",
                    f"Account number: {bank_transfer['account_number']}",
                    "",
                    (
                        "When making the transfer, please use your booking reference "
                        f"{booking['reference_code']} as the payment reference."
                    ),
                    bank_transfer["instructions"],
                    "",
                    "Your booking will remain pending until the deposit has been confirmed.",
                    "",
                    "GLEEMAKEOVERS",
                ]
            )

            self._send_message(
                to_email=customer["email"],
                subject=f"Booking received - {booking['reference_code']}",
                body=body,
            )
        except Exception:
            self.logger.exception(
                "booking_received_email_failed",
                extra={"booking_reference": booking.get("reference_code")},
            )

    def _send_admin_booking_submitted(self, booking: Mapping[str, Any]) -> None:
        admin_email = self.config.get("ADMIN_NOTIFICATION_EMAIL") or self.config.get("FROM_EMAIL")
        if not admin_email:
            self.logger.warning(
                "admin_booking_email_skipped_missing_recipient",
                extra={"booking_reference": booking.get("reference_code")},
            )
            return

        try:
            customer = booking["customer"]
            service = booking["service"]
            amounts = booking["amounts"]

            body = "\n".join(
                [
                    "A new booking has been submitted.",
                    "",
                    f"Booking reference: {booking['reference_code']}",
                    f"Customer name: {customer['name']}",
                    f"Customer email: {customer['email']}",
                    f"Customer phone: {customer['phone']}",
                    f"Service: {service.get('name') or 'Selected service'}",
                    f"Date: {_format_booking_date(booking['booking_date'])}",
                    f"Time: {_format_booking_time(booking['start_time'])}",
                    f"Total amount: {_format_amount_pence(amounts['total_amount_pence'])}",
                    f"Deposit amount: {_format_amount_pence(amounts['deposit_amount_pence'])}",
                ]
            )

            self._send_message(
                to_email=str(admin_email),
                subject=f"New booking submitted - {booking['reference_code']}",
                body=body,
            )
        except Exception:
            self.logger.exception(
                "admin_booking_notification_failed",
                extra={"booking_reference": booking.get("reference_code")},
            )

    def send_deposit_confirmed(self, booking: Mapping[str, Any]) -> None:
        try:
            customer = booking["customer"]
            service = booking["service"]

            body = "\n".join(
                [
                    f"Hello {customer['name']},",
                    "",
                    "Your deposit has been confirmed and your booking is now secured.",
                    "",
                    f"Booking reference: {booking['reference_code']}",
                    f"Service: {service.get('name') or 'Selected service'}",
                    f"Date: {_format_booking_date(booking['booking_date'])}",
                    f"Time: {_format_booking_time(booking['start_time'])}",
                    "",
                    "Thank you. We look forward to your appointment.",
                    "",
                    "GLEEMAKEOVERS",
                ]
            )

            self._send_message(
                to_email=customer["email"],
                subject=f"Deposit confirmed - {booking['reference_code']}",
                body=body,
            )
        except Exception:
            self.logger.exception(
                "deposit_confirmed_email_failed",
                extra={"booking_reference": booking.get("reference_code")},
            )

    def send_test_email(self, to_email: str) -> None:
        body = "\n".join(
            [
                "Hello,",
                "",
                "This is a test email from the GLEEMAKEOVERS booking system.",
                "If you received this message, email delivery is configured correctly.",
                "",
                "GLEEMAKEOVERS",
            ]
        )
        self._send_message(
            to_email=to_email,
            subject="GLEEMAKEOVERS email test",
            body=body,
        )

    def _send_message(self, *, to_email: str, subject: str, body: str) -> None:
        api_base_url = self.config.get("EMAIL_API_BASE_URL")
        api_key = self.config.get("EMAIL_API_KEY")
        from_email = self.config.get("FROM_EMAIL")

        missing = [
            key
            for key, value in (
                ("EMAIL_API_BASE_URL", api_base_url),
                ("EMAIL_API_KEY", api_key),
                ("FROM_EMAIL", from_email),
            )
            if not value
        ]
        if missing:
            raise EmailDeliveryError(
                f"Email settings are not configured: {', '.join(missing)}",
            )

        payload = json.dumps(
            {
                "from": str(from_email),
                "to": [to_email],
                "subject": subject,
                "text": body,
            }
        ).encode("utf-8")

        request = Request(
            str(api_base_url),
            data=payload,
            method="POST",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "gleemakeovers-backend/1.0",
            },
        )

        try:
            with urlopen(request, timeout=15) as response:
                status_code = getattr(response, "status", None) or response.getcode()
                if status_code < 200 or status_code >= 300:
                    raise EmailDeliveryError(
                        f"Email provider returned status {status_code}.",
                        status_code=status_code,
                    )
        except HTTPError as error:
            try:
                response_body = error.read().decode("utf-8", errors="replace")
            except Exception:
                response_body = ""

            message = response_body or f"Email provider returned status {error.code}."
            raise EmailDeliveryError(message, status_code=error.code) from error
        except URLError as error:
            raise EmailDeliveryError(f"Email provider request failed: {error.reason}") from error


def _format_amount_pence(value: int) -> str:
    pounds = value / 100
    if pounds.is_integer():
        return f"£{int(pounds)}"
    return f"£{pounds:.2f}"


def _format_booking_date(value: str) -> str:
    return date.fromisoformat(value).strftime("%d %B %Y")


def _format_booking_time(value: str) -> str:
    parsed = time.fromisoformat(value)
    return parsed.strftime("%I:%M %p").lstrip("0")
