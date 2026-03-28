// Services listing with editorial sections.
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./page.module.css";
import {
  SERVICE_CATEGORY_ORDER,
  getServiceCategoryDetails,
} from "../../lib/service-categories";


export default function ServicesPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className={styles.page}>
      <motion.section
        className={styles.intro}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.6 },
              transition: { duration: 0.8, ease: "easeOut" },
            })}
      >
        <h1>Services</h1>
        <p className={styles.introText}>
          Explore service categories first, then move into a focused booking
          step with the right options already narrowed for you.
        </p>
      </motion.section>

      <section className={styles.list}>
        {SERVICE_CATEGORY_ORDER.map((category, index) => {
          const details = getServiceCategoryDetails(category);
          const isReversed = index % 2 !== 0;

          return (
            <motion.article
              key={category}
              className={`${styles.serviceSection} ${
                isReversed ? styles.serviceSectionAlt : ""
              }`}
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 24 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.35 },
                    transition: { duration: 0.7, ease: "easeOut" },
                  })}
            >
              <div
                className={`${styles.serviceContent} ${
                  isReversed ? styles.serviceContentReverse : ""
                }`}
              >
                <div className={styles.serviceText}>
                  <p className={styles.categoryEyebrow}>Service category</p>
                  <h2 className={styles.cardTitle}>{category}</h2>
                  <p className={styles.serviceDescriptor}>
                    {details.description}
                  </p>
                  <Link
                    href={`/book/service?category=${encodeURIComponent(category)}`}
                    className={styles.cardLink}
                  >
                    {details.ctaLabel}
                  </Link>
                </div>
                <div className={styles.serviceImageWrap}>
                  <Image
                    src={details.imageSrc}
                    alt={details.imageAlt}
                    fill
                    className={styles.serviceImage}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>
    </main>
  );
}
