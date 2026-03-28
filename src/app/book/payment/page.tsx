// Booking step 4: capture customer details before submission.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBookingDraft, updateBookingDraft } from "../../../core/booking/store";
import { formatBookingDate, formatBookingTime } from "../../../lib/booking-format";
import { formatPence } from "../../../lib/money";
import styles from "../flow.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_LETTER_PATTERN = /[\p{L}]/u;

type FieldErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
};

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const draft = getBookingDraft();
    if (!draft.service) {
      router.replace("/services");
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

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim();
    const normalizedPhone = phone.trim();
    const normalizedNotes = notes.trim();
    const nextErrors: FieldErrors = {};

    if (!normalizedName) {
      nextErrors.fullName = "Please enter your name.";
    } else if (!NAME_LETTER_PATTERN.test(normalizedName)) {
      nextErrors.fullName = "Please enter your name using letters.";
    }

    if (!normalizedEmail) {
      nextErrors.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!normalizedPhone) {
      nextErrors.phone = "Please enter your phone number.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    updateBookingDraft({
      customer_name: normalizedName,
      customer_email: normalizedEmail,
      customer_phone: normalizedPhone,
      notes: normalizedNotes,
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
                  className={`${styles.input} ${
                    fieldErrors.fullName ? styles.inputError : ""
                  }`}
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setFieldErrors((current) => ({ ...current, fullName: undefined }));
                  }}
                  placeholder="Your full name"
                  aria-invalid={Boolean(fieldErrors.fullName)}
                  aria-describedby={
                    fieldErrors.fullName ? "customer-name-error" : undefined
                  }
                />
                {fieldErrors.fullName ? (
                  <p id="customer-name-error" className={styles.fieldError}>
                    {fieldErrors.fullName}
                  </p>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="customer-email" className={styles.label}>
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  className={`${styles.input} ${
                    fieldErrors.email ? styles.inputError : ""
                  }`}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((current) => ({ ...current, email: undefined }));
                  }}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={
                    fieldErrors.email ? "customer-email-error" : undefined
                  }
                />
                {fieldErrors.email ? (
                  <p id="customer-email-error" className={styles.fieldError}>
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="customer-phone" className={styles.label}>
                  Phone number
                </label>
                <input
                  id="customer-phone"
                  className={`${styles.input} ${
                    fieldErrors.phone ? styles.inputError : ""
                  }`}
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setFieldErrors((current) => ({ ...current, phone: undefined }));
                  }}
                  placeholder="+44 7000 000000"
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={
                    fieldErrors.phone ? "customer-phone-error" : undefined
                  }
                />
                {fieldErrors.phone ? (
                  <p id="customer-phone-error" className={styles.fieldError}>
                    {fieldErrors.phone}
                  </p>
                ) : null}
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
