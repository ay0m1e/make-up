// API helpers for fetching active services from the booking backend.
import { parseJsonResponse } from "./client";
import type { Service, ServiceListResponse } from "../types";

export async function getServices(): Promise<Service[]> {
  const response = await fetch("/api/services", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  try {
    const payload = await parseJsonResponse<ServiceListResponse>(response);
    return payload.data;
  } catch {
    throw new Error("Unable to load services right now. Please refresh and try again.");
  }
}
