// Biography page for the makeup artist.
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { placeholderImage } from "../../media";
import styles from "./page.module.css";

export default function AboutPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroImageWrap}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 30, scale: 1.08 },
                whileInView: { opacity: 1, y: 0, scale: 1 },
                viewport: { once: true, amount: 0.5 },
                transition: { duration: 1, ease: "easeOut" },
              })}
        >
          <Image
            src={placeholderImage}
            alt="Portrait of the makeup artist"
            fill
            className={styles.heroImage}
            sizes="(min-width: 1024px) 35vw, 100vw"
            priority
          />
        </motion.div>
        <motion.div
          className={styles.heroContent}
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 22 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.6 },
                transition: { duration: 0.8, ease: "easeOut", delay: 0.1 },
              })}
        >
          <p className={styles.eyebrow}>
            About
          </p>
          <h1>Ife | GLEEMAKEOVERS</h1>
          <p className={styles.heroText}>
            Global makeup artist, beauty educator, and founder of
            GLEEMAKEOVERS.
          </p>
        </motion.div>
      </section>

      <motion.section
        className={styles.biography}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.4 },
              transition: { duration: 0.8, ease: "easeOut" },
            })}
      >
        <h2>Biography</h2>
        <div className={styles.bioText}>
          <p>
            Ife is a qualified and trained makeup artist with a long-standing
            passion for beauty. Her approach is calm, professional, and centered
            on enhancing natural features.
          </p>
          <p>
            Her work is known for soft, natural, and classy finishes. She
            provides makeup artistry, bridal hair styling, and semi-permanent
            brow services for weddings, events, and photoshoots.
          </p>
          <p>
            Client care is central to every appointment, with a focus on
            thoughtful preparation, clean finishes, and lasting wear.
          </p>
        </div>
      </motion.section>

      <motion.section
        className={styles.credentials}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.5 },
              transition: { duration: 0.8, ease: "easeOut" },
            })}
      >
        <p className={styles.eyebrow}>
          Credentials
        </p>
        <div className={styles.credentialsGrid}>
          <p>Qualified and trained makeup artist</p>
          <p>Professional training and masterclasses</p>
          <p>Soft, natural, and classy finishes</p>
          <p>Makeup, bridal hair styling, and brows</p>
        </div>
      </motion.section>

      <motion.section
        className={styles.cta}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.6 },
              transition: { duration: 0.8, ease: "easeOut" },
            })}
      >
        <p className={styles.eyebrow}>
          Begin the experience
        </p>
        <h2>Book a private appointment with GLEEMAKEOVERS.</h2>
        <p className={styles.ctaText}>
          Share your date and details for a personalized makeup experience.
        </p>
        <Link
          href="/book/service"
          className={styles.ctaButton}
        >
          Book an Appointment
        </Link>
      </motion.section>
    </main>
  );
}
