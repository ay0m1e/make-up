// API helpers for creating bookings against the Flask backend.
import type { BookingConfirmation, CreateBookingPayload } from "../types";

export class PublicBookingError extends Error {
  status: number;
  title: string;

  constructor(title: string, message: string, status: number) {
    super(message);
    this.name = "PublicBookingError";
    this.status = status;
    this.title = title;
  }
}

async function parseBookingError(response: Response) {
  let payload: { error?: string; message?: string } | null = null;
  try {
    payload = (await response.json()) as { error?: string; message?: string };
  } catch {
    // Ignore body parsing errors here and fall back to calm public messaging.
  }

  if (response.status === 409) {
    return new PublicBookingError(
      "That time is no longer available",
      "Someone just booked this slot. Please choose another time to continue.",
      409,
    );
  }

  if (response.status === 400) {
    if (payload?.error === "invalid_time_range") {
      return new PublicBookingError(
        "That start time will not work",
        "This service needs more time than this slot allows. Please choose an earlier time.",
        400,
      );
    }

    return new PublicBookingError(
      "Please review your booking details",
      "Some booking details need attention before we can continue. Please check your information and try again.",
      400,
    );
  }

  if (response.status === 502 || response.status >= 500) {
    return new PublicBookingError(
      "We could not complete your booking",
      "Please try again in a moment. If the issue continues, contact the studio directly.",
      response.status,
    );
  }

  return new PublicBookingError(
    "We could not complete your booking",
    "Please try again in a moment. If the issue continues, contact the studio directly.",
    response.status,
  );
}

export async function createBooking(payload: CreateBookingPayload): Promise<BookingConfirmation> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return (await response.json()) as BookingConfirmation;
  }

  throw await parseBookingError(response);
}
