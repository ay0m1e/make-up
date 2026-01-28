// Services API module for fetching service listings.
import type { Service } from "../types";

export async function getServices(): Promise<Service[]> {
  const response = await fetch("/services", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let detail = "";
    try {
      const data = (await response.json()) as { error?: unknown; message?: unknown };
      detail = String(data.error ?? data.message ?? "");
    } catch {
      try {
        detail = await response.text();
      } catch {
        detail = "";
      }
    }

    const suffix = detail ? ` - ${detail}` : "";
    throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}${suffix}`);
  }

  const data = (await response.json()) as Service[];
  return data;
}
