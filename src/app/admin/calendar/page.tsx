import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "../../../core/auth/auth";
import { AdminNav } from "../AdminNav";
import styles from "../admin.module.css";
import { CalendarClient } from "./CalendarClient";

export default async function AdminCalendarPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_SESSION_COOKIE)?.value) {
    redirect("/admin/login");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Admin</p>
          <h1>Calendar view</h1>
          <p className={styles.subtext}>
            Review upcoming bookings by week, grouped by date for a cleaner view of the schedule.
          </p>
        </header>
        <AdminNav />
        <CalendarClient />
      </div>
    </main>
  );
}
