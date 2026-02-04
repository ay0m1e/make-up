// Booking step 2: choose a date.
import Image from "next/image";
import Link from "next/link";
import { DatePicker } from "../../../components/DatePicker";
import { placeholderImage } from "../../../media";
import styles from "./page.module.css";

const dateOptions = [
  "Tuesday, March 12 - Morning",
  "Wednesday, March 13 - Afternoon",
  "Friday, March 15 - Morning",
  "Saturday, March 16 - Afternoon",
  "Tuesday, March 19 - Morning",
  "Thursday, March 21 - Afternoon",
];

export default function BookDatePage() {
  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          Step 2 of 4
        </p>
        <h1>Select a preferred date</h1>
        <p className={styles.subtext}>
          Share your preferred windows and the studio will confirm the final
          timing with you.
        </p>
      </div>

      <section className={styles.content}>
        <div className={styles.form}>
          <DatePicker dates={dateOptions} />
          <Link
            href="/book/time"
            className={styles.cta}
          >
            Continue to time
          </Link>
        </div>
        <div className={styles.imageWrap}>
          <Image
            src={placeholderImage}
            alt="Makeup brushes laid out for a session"
            fill
            className={styles.image}
            sizes="(min-width: 1024px) 28vw, 100vw"
          />
        </div>
      </section>
    </main>
  );
}
