// Same-origin admin API helpers.
import { parseJsonResponse } from "./client";
import type {
  AdminBooking,
  AdminBookingListResponse,
  AdminBookingResponse,
  AdminLoginPayload,
  AdminLoginResponse,
  AdminServicePayload,
  AdminServiceResponse,
  Service,
  ServiceListResponse,
} from "../types";

type GetAdminBookingsOptions = {
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
};

export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminLoginResponse>(response);
}

export async function getAdminBookings(
  options: GetAdminBookingsOptions = {},
): Promise<AdminBooking[]> {
  const searchParams = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  const response = await fetch(`/api/admin/bookings${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const payload = await parseJsonResponse<AdminBookingListResponse>(response);
  return payload.data;
}

export async function confirmAdminBookingDeposit(bookingId: string): Promise<AdminBooking> {
  const response = await fetch(`/api/admin/bookings/${bookingId}/confirm-deposit`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await parseJsonResponse<AdminBookingResponse>(response);
  return payload.data;
}

export async function cancelAdminBooking(bookingId: string): Promise<AdminBooking> {
  const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await parseJsonResponse<AdminBookingResponse>(response);
  return payload.data;
}

export async function getAdminServices(): Promise<Service[]> {
  const response = await fetch("/api/admin/services", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const payload = await parseJsonResponse<ServiceListResponse>(response);
  return payload.data;
}

export async function createAdminService(payload: AdminServicePayload): Promise<Service> {
  const response = await fetch("/api/admin/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await parseJsonResponse<AdminServiceResponse>(response);
  return result.data;
}

export async function updateAdminService(
  serviceId: string,
  payload: Partial<AdminServicePayload>,
): Promise<Service> {
  const response = await fetch(`/api/admin/services/${serviceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await parseJsonResponse<AdminServiceResponse>(response);
  return result.data;
}

export async function deactivateAdminService(serviceId: string): Promise<Service> {
  const response = await fetch(`/api/admin/services/${serviceId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  const result = await parseJsonResponse<AdminServiceResponse>(response);
  return result.data;
}
