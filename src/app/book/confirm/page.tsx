// Final booking screen with deposit instructions from the backend.
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearBookingDraft, getBookingDraft } from "../../../core/booking/store";
import type { BookingDraft } from "../../../core/types";
import { formatBookingDate, formatBookingTime } from "../../../lib/booking-format";
import { formatPence } from "../../../lib/money";
import styles from "../flow.module.css";

export default function BookConfirmPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  useEffect(() => {
    const currentDraft = getBookingDraft();
    if (!currentDraft.confirmation) {
      router.replace("/book/summary");
      return;
    }

    setDraft(currentDraft);
  }, [router]);

  if (!draft?.confirmation || !draft.service || !draft.booking_date || !draft.start_time) {
    return null;
  }

  function handleStartAnotherBooking() {
    clearBookingDraft();
    router.push("/services");
  }

  return (
    <main className={styles.page}>
      <div className={`${styles.card} ${styles.confirmCard}`}>
        <header className={`${styles.header} ${styles.confirmHeader}`}>
          <p className={styles.eyebrow}>Booking created</p>
          <h1>Deposit instructions</h1>
          <p className={`${styles.subtext} ${styles.confirmLead}`}>
            Your booking is now pending. Use the details below to send the deposit and include
            your booking reference as the transfer reference.
          </p>
        </header>

        <section className={`${styles.summaryGrid} ${styles.confirmGrid}`}>
          <div className={`${styles.card} ${styles.confirmPanel}`}>
            <p className={styles.label}>Booking summary</p>
            <div className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Reference</span>
                <span className={`${styles.summaryValue} ${styles.totalStrong}`}>
                  {draft.confirmation.reference_code}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Service</span>
                <span className={styles.summaryValue}>{draft.service.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Booking status</span>
                <span className={styles.summaryValue}>
                  {draft.confirmation.booking_status.replaceAll("_", " ")}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Payment status</span>
                <span className={styles.summaryValue}>
                  {draft.confirmation.payment_status.replaceAll("_", " ")}
                </span>
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
                <span className={styles.summaryKey}>Total amount</span>
                <span className={styles.summaryValue}>
                  {formatPence(draft.confirmation.total_amount_pence)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryKey}>Deposit required</span>
                <span className={`${styles.summaryValue} ${styles.totalStrong}`}>
                  {formatPence(draft.confirmation.deposit_amount_pence)}
                </span>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardMuted} ${styles.confirmPanel}`}>
            <p className={styles.label}>Transfer details</p>
            <div className={styles.bankGrid}>
              <div className={styles.bankItem}>
                <p className={styles.bankLabel}>Account name</p>
                <p className={styles.bankValue}>{draft.confirmation.bank_transfer.account_name}</p>
              </div>
              <div className={styles.bankItem}>
                <p className={styles.bankLabel}>Sort code</p>
                <p className={styles.bankValue}>{draft.confirmation.bank_transfer.sort_code}</p>
              </div>
              <div className={styles.bankItem}>
                <p className={styles.bankLabel}>Account number</p>
                <p className={styles.bankValue}>{draft.confirmation.bank_transfer.account_number}</p>
              </div>
              <div className={styles.instructionBox}>
                <p className={styles.bankLabel}>Transfer note</p>
                <p className={styles.instructionText}>
                  {draft.confirmation.bank_transfer.instructions}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.linkButton} onClick={handleStartAnotherBooking}>
            Start another booking
          </button>
          <Link href="/" className={styles.primaryButton}>
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
