"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "../../../core/api/admin";
import styles from "../admin.module.css";

function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const parts = error.message.split(" - ");
  return parts.length > 1 ? parts[parts.length - 1] : error.message;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await adminLogin({
        email: email.trim(),
        password,
      });
      router.push("/admin/bookings");
      router.refresh();
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to log in."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`${styles.card} ${styles.loginWrap}`}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="admin-email" className={styles.label}>
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={styles.input}
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="admin-password" className={styles.label}>
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={styles.input}
            autoComplete="current-password"
            required
          />
        </div>

        {error ? (
          <div className={styles.errorBox}>
            <p>{error}</p>
          </div>
        ) : null}

        <button type="submit" className={styles.primaryButton} disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
