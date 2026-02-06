// Shared reviews carousel used across pages.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./ReviewsCarousel.module.css";

type Review = {
  id: string;
  name: string;
  text: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  reviews: Review[];
  previewLength?: number;
  intervalMs?: number;
};

export function ReviewsCarousel({
  eyebrow = "Reviews",
  title,
  reviews,
  previewLength = 170,
  intervalMs = 5000,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [reviewIndex, setReviewIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const getPreview = (text: string) =>
    text.length > previewLength ? `${text.slice(0, previewLength).trim()}...` : text;

  useEffect(() => {
    if (reduceMotion || paused || reviews.length <= 1) return;
    const id = window.setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, reviews.length, intervalMs]);

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.reviewsHeader}>
        <p className={styles.reviewsEyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div
        className={styles.reviewsCarousel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <motion.div
          className={styles.reviewsTrack}
          animate={{ x: `-${reviewIndex * 100}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {reviews.map((review, index) => (
            <div key={review.id ?? `review-${index}`} className={styles.reviewSlide}>
              <div className={styles.reviewCard}>
                <div className={styles.reviewStars}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <svg
                      key={`${review.id ?? `review-${index}`}-star-${index}`}
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className={styles.star}
                    >
                      <path
                        d="M10 2.5l2.25 4.56 5.03.73-3.64 3.55.86 5.02L10 14.2l-4.5 2.21.86-5.02-3.64-3.55 5.03-.73L10 2.5z"
                        fill="currentColor"
                      />
                    </svg>
                  ))}
                </div>
                <p className={styles.reviewText}>{getPreview(review.text)}</p>
                <p className={styles.reviewName}>{review.name}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
