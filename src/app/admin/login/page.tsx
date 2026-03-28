import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "../../../core/auth/auth";
import styles from "../admin.module.css";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_SESSION_COOKIE)?.value) {
    redirect("/admin/bookings");
  }

  return (
    <main className={styles.page}>
      <div className={`${styles.shell} ${styles.loginShell}`}>
        <header className={`${styles.header} ${styles.loginHeader}`}>
          <p className={styles.eyebrow}>Admin</p>
          <h1>Admin login</h1>
          <p className={styles.subtext}>
            Sign in to review bookings, confirm deposits, and manage the booking lifecycle.
          </p>
        </header>
        <LoginForm />
      </div>
    </main>
  );
}
