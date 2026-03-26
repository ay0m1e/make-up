// Booking step 4: capture customer details before submission.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBookingDraft, updateBookingDraft } from "../../../core/booking/store";
import { formatBookingDate, formatBookingTime } from "../../../lib/booking-format";
import { formatPence } from "../../../lib/money";
import styles from "../flow.module.css";

export default function BookPaymentPage() {
  const router = useRouter();
  const [serviceName, setServiceName] = useState("");
  const [pricePence, setPricePence] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

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
    if (!draft.start_time) {
      router.replace("/book/time");
      return;
    }

    setServiceName(draft.service.name);
    setPricePence(draft.service.price_pence);
    setBookingDate(draft.booking_date);
    setStartTime(draft.start_time);
    setFullName(draft.customer_name);
    setEmail(draft.customer_email);
    setPhone(draft.customer_phone);
    setNotes(draft.notes);
  }, [router]);

  function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateBookingDraft({
      customer_name: fullName.trim(),
      customer_email: email.trim(),
      customer_phone: phone.trim(),
      notes: notes.trim(),
    });

    router.push("/book/summary");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Step 4 of 5</p>
          <h1>Share your details</h1>
          <p className={styles.subtext}>
            These details are sent to the backend when you confirm the booking.
          </p>
        </header>

        <div className={styles.summaryGrid}>
          <form className={styles.card} onSubmit={handleContinue}>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor="customer-name" className={styles.label}>
                  Full name
                </label>
                <input
                  id="customer-name"
                  className={styles.input}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="customer-email" className={styles.label}>
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="customer-phone" className={styles.label}>
                  Phone number
                </label>
                <input
                  id="customer-phone"
                  className={styles.input}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+44 7000 000000"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="customer-notes" className={styles.label}>
                  Notes
                </label>
                <textarea
                  id="customer-notes"
                  className={styles.textarea}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Anything the artist should know before the appointment."
                />
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/book/time" className={styles.linkButton}>
                Back
              </Link>
              <button type="submit" className={styles.primaryButton}>
                Continue to summary
              </button>
            </div>
          </form>

          <aside className={`${styles.card} ${styles.cardMuted}`}>
            <p className={styles.label}>Booking summary</p>
            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Service</span>
                <span className={styles.summaryValue}>{serviceName}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Date</span>
                <span className={styles.summaryValue}>
                  {bookingDate ? formatBookingDate(bookingDate) : ""}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Time</span>
                <span className={styles.summaryValue}>
                  {startTime ? formatBookingTime(startTime) : ""}
                </span>
              </div>
              {pricePence !== null ? (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryKey}>Estimated total</span>
                  <span className={styles.summaryValue}>{formatPence(pricePence)}</span>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
