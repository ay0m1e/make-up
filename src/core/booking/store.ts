// Browser-backed booking draft store for the multi-step flow.
import type { BookingConfirmation, BookingDraft, Service } from "../types";

const STORAGE_KEY = "gleemakeovers-booking-draft";

const DEFAULT_DRAFT: BookingDraft = {
  quantity: 1,
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  notes: "",
};

let memoryDraft: BookingDraft = { ...DEFAULT_DRAFT };

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeDraft(input: unknown): BookingDraft {
  if (!input || typeof input !== "object") {
    return { ...DEFAULT_DRAFT };
  }

  const value = input as Partial<BookingDraft>;
  return {
    ...DEFAULT_DRAFT,
    ...value,
  };
}

function readStoredDraft() {
  if (!canUseStorage()) {
    return memoryDraft;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_DRAFT };
    }
    return sanitizeDraft(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_DRAFT };
  }
}

function persistDraft(draft: BookingDraft) {
  memoryDraft = draft;
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function getBookingDraft() {
  const draft = readStoredDraft();
  memoryDraft = draft;
  return draft;
}

export function startBooking(service: Service) {
  const draft: BookingDraft = {
    ...DEFAULT_DRAFT,
    service,
  };
  persistDraft(draft);
  return draft;
}

export function updateBookingDraft(patch: Partial<BookingDraft>) {
  const draft = {
    ...getBookingDraft(),
    ...patch,
  };
  persistDraft(draft);
  return draft;
}

export function saveBookingConfirmation(confirmation: BookingConfirmation) {
  return updateBookingDraft({ confirmation });
}

export function clearBookingDraft() {
  memoryDraft = { ...DEFAULT_DRAFT };
  if (canUseStorage()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return memoryDraft;
}
