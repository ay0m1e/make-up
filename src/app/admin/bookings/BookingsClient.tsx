"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  cancelAdminBooking,
  confirmAdminBookingDeposit,
  getAdminBookings,
} from "../../../core/api/admin";
import type { AdminBooking } from "../../../core/types";
import { formatBookingDate, formatBookingTime } from "../../../lib/booking-format";
import { formatPence } from "../../../lib/money";
import styles from "../admin.module.css";

function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const parts = error.message.split(" - ");
  return parts.length > 1 ? parts[parts.length - 1] : error.message;
}

function getStatusClass(status: string) {
  switch (status) {
    case "pending":
      return styles.statusPending;
    case "confirmed":
      return styles.statusConfirmed;
    case "cancelled":
      return styles.statusCancelled;
    case "deposit_paid":
      return styles.statusDepositPaid;
    case "awaiting_transfer":
      return styles.statusAwaitingTransfer;
    default:
      return styles.statusPending;
  }
}

export function BookingsClient() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionKey, setActionKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      setLoading(true);
      setError(null);

      try {
        const response = await getAdminBookings();
        if (!active) {
          return;
        }
        setBookings(response);
      } catch (loadError) {
        if (!active) {
          return;
        }

        const rawMessage = loadError instanceof Error ? loadError.message : "";
        const message = getErrorMessage(loadError, "Unable to load bookings.");
        if (rawMessage.includes("401")) {
          router.replace("/admin/login");
          return;
        }
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleConfirmDeposit(bookingId: string) {
    setActionKey(`confirm:${bookingId}`);
    setError(null);

    try {
      const updated = await confirmAdminBookingDeposit(bookingId);
      setBookings((current) =>
        current.map((booking) => (booking.id === bookingId ? updated : booking)),
      );
    } catch (actionError) {
      const rawMessage = actionError instanceof Error ? actionError.message : "";
      const message = getErrorMessage(actionError, "Unable to confirm deposit.");
      if (rawMessage.includes("401")) {
        router.replace("/admin/login");
        return;
      }
      setError(message);
    } finally {
      setActionKey(null);
    }
  }

  async function handleCancelBooking(bookingId: string) {
    setActionKey(`cancel:${bookingId}`);
    setError(null);

    try {
      const updated = await cancelAdminBooking(bookingId);
      setBookings((current) =>
        current.map((booking) => (booking.id === bookingId ? updated : booking)),
      );
    } catch (actionError) {
      const rawMessage = actionError instanceof Error ? actionError.message : "";
      const message = getErrorMessage(actionError, "Unable to cancel booking.");
      if (rawMessage.includes("401")) {
        router.replace("/admin/login");
        return;
      }
      setError(message);
    } finally {
      setActionKey(null);
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.eyebrow}>Bookings</p>
          <p className={styles.count}>
            {loading ? "Loading bookings..." : `${bookings.length} booking(s)`}
          </p>
        </div>
      </div>

      {error ? (
        <div className={styles.errorBox}>
          <p>{error}</p>
        </div>
      ) : null}

      {loading ? <div className={styles.card}>Loading bookings...</div> : null}

      {!loading && bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No bookings yet.</p>
        </div>
      ) : null}

      {!loading && bookings.length > 0 ? (
        <div className={styles.list}>
          {bookings.map((booking) => {
            const confirmDisabled =
              booking.payment_status !== "awaiting_transfer" || booking.booking_status === "cancelled";
            const cancelDisabled = booking.booking_status === "cancelled";

            return (
              <article key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div>
                    <h2 className={styles.reference}>{booking.reference_code}</h2>
                    <p className={styles.customer}>{booking.customer.name}</p>
                  </div>
                  <div className={styles.statusRow}>
                    <span className={`${styles.statusPill} ${getStatusClass(booking.booking_status)}`}>
                      {booking.booking_status.replaceAll("_", " ")}
                    </span>
                    <span className={`${styles.statusPill} ${getStatusClass(booking.payment_status)}`}>
                      {booking.payment_status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>

                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Service</span>
                    <span className={styles.metaValue}>{booking.service.name ?? "Unknown service"}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Date</span>
                    <span className={styles.metaValue}>{formatBookingDate(booking.booking_date)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Time</span>
                    <span className={styles.metaValue}>{formatBookingTime(booking.start_time)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Deposit</span>
                    <span className={styles.metaValue}>
                      {formatPence(booking.amounts.deposit_amount_pence)}
                    </span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => handleConfirmDeposit(booking.id)}
                    disabled={confirmDisabled || actionKey === `confirm:${booking.id}`}
                  >
                    {actionKey === `confirm:${booking.id}` ? "Saving..." : "Confirm deposit"}
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={cancelDisabled || actionKey === `cancel:${booking.id}`}
                  >
                    {actionKey === `cancel:${booking.id}` ? "Saving..." : "Cancel booking"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
