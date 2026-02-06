// Editorial portfolio page.
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { placeholderImage } from "../../media";
import styles from "./page.module.css";

const portfolio = [
  {
    alt: "Editorial beauty portrait with soft glow",
    title: "Soft Glam Finish",
  },
  {
    alt: "Neutral bridal makeup with satin skin",
    title: "Bridal Glow",
  },
  {
    alt: "Studio portrait with muted tones",
    title: "Studio Soft Matte",
  },
  {
    alt: "Evening look with sculpted cheeks",
    title: "Evening Sculpt",
  },
  {
    alt: "Fashion week makeup detail",
    title: "Editorial Detail",
  },
  {
    alt: "Soft-focus campaign beauty portrait",
    title: "Radiant Focus",
  },
];

export default function WorkPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className={styles.page}>
      <motion.div
        className={styles.header}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.7 },
              transition: { duration: 0.8, ease: "easeOut" },
            })}
      >
        <div className={styles.headerContent}>
          <p className={styles.eyebrow}>
            Work
          </p>
          <h1>Recent looks and finishes.</h1>
        </div>
        <p className={styles.headerText}>
          A concise edit of bridal, event, and photoshoot looks with a soft,
          polished finish.
        </p>
      </motion.div>

      <section className={styles.grid}>
        {portfolio.map((item) => (
          <motion.figure
            key={item.title}
            className={styles.card}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 30, rotate: -2 },
                  whileInView: { opacity: 1, y: 0, rotate: 0 },
                  viewport: { once: true, amount: 0.4 },
                  transition: { duration: 0.8, ease: "easeOut" },
                })}
            whileHover={reduceMotion ? undefined : { scale: 1.02, rotate: 1 }}
          >
            <div className={styles.imageWrap}>
              <Image
                src={placeholderImage}
                alt={item.alt}
                fill
                className={styles.image}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              />
            </div>
            <figcaption className={styles.caption}>
              {item.title}
            </figcaption>
          </motion.figure>
        ))}
      </section>
    </main>
  );
}
