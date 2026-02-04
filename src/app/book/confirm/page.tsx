// Booking confirmation page.
import Image from "next/image";
import Link from "next/link";
import { placeholderImage } from "../../../media";
import styles from "./page.module.css";

export default function BookConfirmPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <Image
            src={placeholderImage}
            alt="Soft makeup kit detail"
            width={160}
            height={160}
            className={styles.avatarImage}
          />
        </div>
        <p className={styles.eyebrow}>
          Request received
        </p>
        <h1 className={styles.title}>Your booking request is confirmed.</h1>
        <p className={styles.text}>
          The studio will review your details and respond within two business
          days with a tailored proposal and next steps.
        </p>
        <div className={styles.actions}>
          <Link
            href="/work"
            className={styles.secondary}
          >
            View the portfolio
          </Link>
          <Link
            href="/"
            className={styles.primary}
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
