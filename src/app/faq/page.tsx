// Frequently asked questions.
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { placeholderImage } from "../../media";
import styles from "./page.module.css";
const faqs = [
  {
    question: "How do I secure my booking?",
    answer:
      "Your appointment is only validated once payment has been made.",
  },
  {
    question: "Is a deposit required for bridal bookings?",
    answer:
      "A 50% deposit is required to validate a bridal package booking.",
  },
  {
    question: "What does the service fee include?",
    answer:
      "Rates listed cover one look per booking. Additional looks and touch-ups are charged separately.",
  },
  {
    question: "What if I need extra time after my appointment?",
    answer:
      "Extra waiting time is charged at £20 per additional hour.",
  },
  {
    question: "Is travel included in the price?",
    answer:
      "Rates cover locations within 5 miles of LS10. Transportation and accommodation are required from the client for other locations.",
  },
  {
    question: "Do you provide lashes?",
    answer:
      "Free quality mink lashes are provided. Clients may also supply their own.",
  },
  {
    question: "Will my makeup be used on social media?",
    answer:
      "Most jobs are posted on social media, but you can opt out if you prefer.",
  },
  {
    question: "Do bridal prices include touch-ups and travel?",
    answer:
      "Bridal package prices exclude touch-ups, transportation, and accommodation.",
  },
];

export default function FaqPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 18 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.7 },
                transition: { duration: 0.7, ease: "easeOut" },
              })}
        >
          <p className={styles.eyebrow}>
            FAQ
          </p>
          <h1>Answers for a calm, confident booking.</h1>
          <p className={styles.heroText}>
            The most common questions from brides, clients, and creative teams.
          </p>
        </motion.div>
        <motion.div
          className={styles.heroImageWrap}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20, scale: 1.06 },
                whileInView: { opacity: 1, y: 0, scale: 1 },
                viewport: { once: true, amount: 0.5 },
                transition: { duration: 0.9, ease: "easeOut" },
              })}
        >
          <Image
            src={placeholderImage}
            alt="Soft portrait with neutral tones"
            fill
            className={styles.heroImage}
            sizes="(min-width: 1024px) 30vw, 100vw"
          />
        </motion.div>
      </div>

      <section className={styles.list}>
        {faqs.map((faq) => (
          <motion.div
            key={faq.question}
            className={styles.card}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 18 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.6 },
                  transition: { duration: 0.6, ease: "easeOut" },
                })}
          >
            <h3 className={styles.cardTitle}>{faq.question}</h3>
            <p className={styles.cardText}>{faq.answer}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
