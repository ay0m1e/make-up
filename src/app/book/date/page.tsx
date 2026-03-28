// Booking step 2: choose a booking date.
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getBookingDraft, updateBookingDraft } from "../../../core/booking/store";
import { getBookServicePath } from "../../../lib/service-categories";
import { formatPence } from "../../../lib/money";
import styles from "../flow.module.css";

export default function BookDatePage() {
  const router = useRouter();
  const [bookingDate, setBookingDate] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState<number | null>(null);
  const [serviceSelectionHref, setServiceSelectionHref] = useState("/services");

  useEffect(() => {
    const draft = getBookingDraft();
    if (!draft.service) {
      router.replace("/services");
      return;
    }

    setBookingDate(draft.booking_date ?? "");
    setServiceName(draft.service.name);
    setServicePrice(draft.service.price_pence);
    setServiceSelectionHref(getBookServicePath(draft.service));
  }, [router]);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bookingDate) {
      return;
    }

    updateBookingDraft({
      booking_date: bookingDate,
      start_time: undefined,
      confirmation: undefined,
    });
    router.push("/book/time");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Step 2 of 5</p>
          <h1>Select a date</h1>
          <p className={styles.subtext}>
            Pick a preferred appointment date so the start time can be chosen next.
          </p>
        </header>

        <div className={styles.summaryGrid}>
          <form className={styles.card} onSubmit={handleContinue}>
            <div className={styles.field}>
              <label htmlFor="booking-date" className={styles.label}>
                Booking date
              </label>
              <input
                id="booking-date"
                type="date"
                value={bookingDate}
                min={minDate}
                onChange={(event) => setBookingDate(event.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.actions}>
              <Link href={serviceSelectionHref} className={styles.linkButton}>
                Back
              </Link>
              <button type="submit" className={styles.primaryButton}>
                Continue to time
              </button>
            </div>
          </form>

          <aside className={`${styles.card} ${styles.cardMuted}`}>
            <p className={styles.label}>Selected service</p>
            <h3>{serviceName || "Service required"}</h3>
            {servicePrice !== null ? (
              <p className={styles.helperText}>Starting from {formatPence(servicePrice)}</p>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
