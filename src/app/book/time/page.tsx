// Booking step 3: choose a start time.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBookingDraft, updateBookingDraft } from "../../../core/booking/store";
import { formatBookingDate, formatBookingTime } from "../../../lib/booking-format";
import styles from "../flow.module.css";

const TIME_OPTIONS = [
  { value: "08:00:00", label: "8:00 AM", note: "Early start" },
  { value: "09:30:00", label: "9:30 AM", note: "Morning" },
  { value: "11:00:00", label: "11:00 AM", note: "Late morning" },
  { value: "13:00:00", label: "1:00 PM", note: "Midday" },
  { value: "15:00:00", label: "3:00 PM", note: "Afternoon" },
  { value: "17:00:00", label: "5:00 PM", note: "Evening" },
];

export default function BookTimePage() {
  const router = useRouter();
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    const draft = getBookingDraft();
    if (!draft.service) {
      router.replace("/book/service");
      return;
    }
    if (!draft.booking_date) {
      router.replace("/book/date");
      return;
    }

    setBookingDate(draft.booking_date);
    setStartTime(draft.start_time ?? "");
  }, [router]);

  function handleContinue() {
    if (!startTime) {
      return;
    }

    updateBookingDraft({
      start_time: startTime,
      confirmation: undefined,
    });
    router.push("/book/payment");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Step 3 of 5</p>
          <h1>Select a start time</h1>
          <p className={styles.subtext}>
            Choose a simple test slot for {bookingDate ? formatBookingDate(bookingDate) : "your date"}.
          </p>
        </header>

        <section className={styles.section}>
          <div className={styles.slotsGrid}>
            {TIME_OPTIONS.map((option) => {
              const isSelected = option.value === startTime;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.slotButton} ${isSelected ? styles.slotSelected : ""}`}
                  onClick={() => setStartTime(option.value)}
                >
                  <span className={styles.slotLabel}>{option.label}</span>
                  <span className={styles.slotNote}>{option.note}</span>
                </button>
              );
            })}
          </div>

          {startTime ? (
            <p className={styles.helperText}>
              Selected time: {formatBookingTime(startTime)}
            </p>
          ) : null}

          <div className={styles.actions}>
            <Link href="/book/date" className={styles.linkButton}>
              Back
            </Link>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleContinue}
              disabled={!startTime}
            >
              Continue to details
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
