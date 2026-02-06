// Booking step 4: share details (no payment processing yet).
import Image from "next/image";
import Link from "next/link";
import { placeholderImage } from "../../../media";
import styles from "./page.module.css";

export default function BookPaymentPage() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          Step 4 of 4
        </p>
        <h1>Share your details</h1>
        <p className={styles.subtext}>
          Provide a few details so the studio can confirm your appointment and
          send the final proposal.
        </p>
      </div>

      <section className={styles.content}>
        <form className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>
              Full name
            </label>
            <input
              type="text"
              placeholder="Alexandra Monroe"
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Email
            </label>
            <input
              type="email"
              placeholder="alexandra@email.com"
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Event location
            </label>
            <input
              type="text"
              placeholder="City Centre, Leeds"
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Notes for the artist
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about your vision, inspiration, or timeline."
              className={styles.textarea}
            />
          </div>
          <Link
            href="/book/confirm"
            className={styles.submit}
          >
            Submit request
          </Link>
        </form>

        <aside className={styles.summary}>
          <div className={styles.summaryImageWrap}>
            <Image
              src={placeholderImage}
              alt="Soft lighting with makeup tools on a vanity"
              fill
              className={styles.summaryImage}
              sizes="(min-width: 1024px) 25vw, 100vw"
            />
          </div>
          <div className={styles.summaryBlock}>
            <p className={styles.label}>
              Appointment
            </p>
            <p className={styles.summaryTitle}>
              Bridal Atelier
            </p>
            <p className={styles.summaryText}>
              Two-hour bridal appointment with soft, luminous finish.
            </p>
          </div>
          <div className={styles.summaryDetails}>
            <p>Date window: 16 March 2026, Afternoon</p>
            <p>Time window: 1:00 PM</p>
            <p>Estimated investment: From £650</p>
          </div>
          <p className={styles.label}>
            Deposits and contracts are shared after confirmation.
          </p>
        </aside>
      </section>
    </main>
  );
}
