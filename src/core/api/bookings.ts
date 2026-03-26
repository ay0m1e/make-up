// API helpers for creating bookings against the Flask backend.
import { parseJsonResponse } from "./client";
import type { BookingConfirmation, CreateBookingPayload } from "../types";

export async function createBooking(payload: CreateBookingPayload): Promise<BookingConfirmation> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<BookingConfirmation>(response);
}
