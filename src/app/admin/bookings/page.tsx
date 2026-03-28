import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "../../../core/auth/auth";
import styles from "../admin.module.css";
import { AdminNav } from "../AdminNav";
import { BookingsClient } from "./BookingsClient";

export default async function AdminBookingsPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_SESSION_COOKIE)?.value) {
    redirect("/admin/login");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Admin</p>
          <h1>Booking dashboard</h1>
          <p className={styles.subtext}>
            Review incoming bookings, confirm deposits, and cancel bookings when needed.
          </p>
        </header>
        <AdminNav />
        <BookingsClient />
      </div>
    </main>
  );
}
