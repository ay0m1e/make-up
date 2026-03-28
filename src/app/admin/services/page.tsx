import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "../../../core/auth/auth";
import { AdminNav } from "../AdminNav";
import styles from "../admin.module.css";
import { ServicesClient } from "./ServicesClient";

export default async function AdminServicesPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_SESSION_COOKIE)?.value) {
    redirect("/admin/login");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Admin</p>
          <h1>Service management</h1>
          <p className={styles.subtext}>
            Maintain published services used by the public booking flow.
          </p>
        </header>
        <AdminNav />
        <ServicesClient />
      </div>
    </main>
  );
}
