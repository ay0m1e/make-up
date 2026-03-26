// Booking step 5: review booking details and create the booking.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "../../../core/api/bookings";
import { getBookingDraft, saveBookingConfirmation } from "../../../core/booking/store";
import type { BookingDraft } from "../../../core/types";
import { formatBookingDate, formatBookingTime } from "../../../lib/booking-format";
import { formatPence } from "../../../lib/money";
import styles from "../flow.module.css";

export default function BookSummaryPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentDraft = getBookingDraft();
    if (!currentDraft.service) {
      router.replace("/book/service");
      return;
    }
    if (!currentDraft.booking_date) {
      router.replace("/book/date");
      return;
    }
    if (!currentDraft.start_time) {
      router.replace("/book/time");
      return;
    }
    if (!currentDraft.customer_name || !currentDraft.customer_email || !currentDraft.customer_phone) {
      router.replace("/book/payment");
      return;
    }

    setDraft(currentDraft);
  }, [router]);

  if (!draft?.service || !draft.booking_date || !draft.start_time) {
    return null;
  }

  const totalAmountPence = draft.service.price_pence * draft.quantity;
  const depositAmountPence = Math.floor(totalAmountPence * 0.5);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const confirmation = await createBooking({
        service_id: draft.service.id,
        booking_date: draft.booking_date,
        start_time: draft.start_time,
        quantity: draft.quantity,
        customer_name: draft.customer_name,
        customer_email: draft.customer_email,
        customer_phone: draft.customer_phone,
        notes: draft.notes || undefined,
      });

      saveBookingConfirmation(confirmation);
      router.push("/book/confirm");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create booking.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Step 5 of 5</p>
          <h1>Review your booking</h1>
          <p className={styles.subtext}>
            Submit this summary to create the booking and receive deposit instructions.
          </p>
        </header>

        <div className={styles.summaryGrid}>
          <section className={styles.card}>
            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Service</span>
                <span className={styles.summaryValue}>{draft.service.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Date</span>
                <span className={styles.summaryValue}>{formatBookingDate(draft.booking_date)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Time</span>
                <span className={styles.summaryValue}>{formatBookingTime(draft.start_time)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Quantity</span>
                <span className={styles.summaryValue}>{draft.quantity}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Full name</span>
                <span className={styles.summaryValue}>{draft.customer_name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Email</span>
                <span className={styles.summaryValue}>{draft.customer_email}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Phone</span>
                <span className={styles.summaryValue}>{draft.customer_phone}</span>
              </div>
              {draft.notes ? (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryKey}>Notes</span>
                  <span className={styles.summaryValue}>{draft.notes}</span>
                </div>
              ) : null}
            </div>
          </section>

          <aside className={`${styles.card} ${styles.cardMuted}`}>
            <p className={styles.label}>Charges</p>
            <div className={styles.totals}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Total</span>
                <span className={styles.summaryValue}>{formatPence(totalAmountPence)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Deposit required</span>
                <span className={`${styles.summaryValue} ${styles.totalStrong}`}>
                  {formatPence(depositAmountPence)}
                </span>
              </div>
            </div>

            {error ? (
              <div className={styles.errorBox}>
                <p>{error}</p>
              </div>
            ) : null}

            <div className={styles.actions}>
              <Link href="/book/payment" className={styles.linkButton}>
                Back
              </Link>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Creating booking..." : "Create booking"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
