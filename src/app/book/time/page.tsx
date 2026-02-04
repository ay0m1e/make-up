// Booking step 3: choose a time window.
import Image from "next/image";
import Link from "next/link";
import { TimeSlot } from "../../../components/TimeSlot";
import { placeholderImage } from "../../../media";
import styles from "./page.module.css";

const timeOptions = [
  { label: "8:00 AM", note: "Early start" },
  { label: "10:30 AM", note: "Morning" },
  { label: "1:00 PM", note: "Midday" },
  { label: "3:30 PM", note: "Afternoon" },
  { label: "6:00 PM", note: "Evening" },
  { label: "7:30 PM", note: "Late" },
];

export default function BookTimePage() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          Step 3 of 4
        </p>
        <h1>Select a time window</h1>
        <p className={styles.subtext}>
          These time windows help the studio confirm travel and prep time for
          your appointment.
        </p>
      </div>

      <section className={styles.content}>
        <div className={styles.form}>
          <div className={styles.grid}>
            {timeOptions.map((option) => (
              <TimeSlot
                key={option.label}
                label={option.label}
                note={option.note}
              />
            ))}
          </div>
          <Link
            href="/book/payment"
            className={styles.cta}
          >
            Continue to details
          </Link>
        </div>
        <div className={styles.imageWrap}>
          <Image
            src={placeholderImage}
            alt="Soft makeup palette with neutral tones"
            fill
            className={styles.image}
            sizes="(min-width: 1024px) 28vw, 100vw"
          />
        </div>
      </section>
    </main>
  );
}
