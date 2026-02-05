// Hidden review form page for client feedback.
"use client";

import { useState } from "react";
import styles from "./page.module.css";

const starValues = [1, 2, 3, 4, 5];

export default function ReviewPage() {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Leave a review</p>
          <h1>Share your experience</h1>
          <p className={styles.subtitle}>
            Your words help future clients feel confident and prepared.
          </p>
        </div>

        {submitted ? (
          <div className={styles.thankYou}>
            <h2>Thank you.</h2>
            <p>Your review has been noted with appreciation.</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Name</span>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span>Review</span>
              <textarea
                name="review"
                placeholder="Share your experience"
                rows={5}
                className={styles.textarea}
              />
            </label>

            <div className={styles.field}>
              <span>Rating</span>
              <div className={styles.stars}>
                {starValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.starButton} ${
                      rating >= value ? styles.starActive : ""
                    }`}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        d="M10 2.5l2.25 4.56 5.03.73-3.64 3.55.86 5.02L10 14.2l-4.5 2.21.86-5.02-3.64-3.55 5.03-.73L10 2.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className={styles.submit}>
              Submit review
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
