// Minimal in-memory booking store for the client.
import type { Service } from "../types";

export type BookingState = {
  selectedService?: Service;
};

let selectedService: Service | undefined;

export function setSelectedService(service: Service) {
  selectedService = service;
}

export function getBookingState(): BookingState {
  return { selectedService };
}
