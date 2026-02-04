// Services listing with editorial cards.
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./page.module.css";

const services = [
  {
    name: "Standard Makeup (Studio)",
    description: "Studio-based makeup appointment.",
    price: "£70",
    duration: "One look",
  },
  {
    name: "Standard Makeup (Home Service)",
    description: "Makeup appointment at your location.",
    price: "£90",
    duration: "One look",
  },
  {
    name: "Photoshoot Makeup",
    description: "Single look for studio or location shoots.",
    price: "£100",
    duration: "One look",
  },
  {
    name: "Makeup + Wig Styling (Studio)",
    description: "Makeup with wig styling in studio.",
    price: "£120",
    duration: "One look",
  },
  {
    name: "Makeup + Wig Styling (Home Service)",
    description: "Makeup with wig styling at your location.",
    price: "£150",
    duration: "One look",
  },
  {
    name: "Gele (One Style)",
    description: "Traditional gele styling.",
    price: "£40",
    duration: "One style",
  },
  {
    name: "Prewedding Shoot",
    description: "Makeup for prewedding photoshoot.",
    price: "£100",
    duration: "One look",
  },
  {
    name: "Bridal Trial Session (Studio)",
    description: "Bridal trial appointment in studio.",
    price: "£100",
    duration: "One look",
  },
  {
    name: "Bridesmaids",
    description: "Makeup for bridesmaids.",
    price: "£90",
    duration: "Per person",
  },
  {
    name: "Registry Wedding",
    description: "Makeup for registry ceremony.",
    price: "£250",
    duration: "Package",
  },
  {
    name: "Traditional Wedding",
    description: "Makeup for traditional ceremony.",
    price: "£300",
    duration: "Package",
  },
  {
    name: "White Wedding",
    description: "Makeup for white wedding ceremony.",
    price: "£300",
    duration: "Package",
  },
  {
    name: "Traditional + White (Same Day)",
    description: "Makeup for both ceremonies on the same day.",
    price: "£500",
    duration: "Package",
  },
  {
    name: "Bridal Hair Prep & Styling",
    description: "Hair preparation and bridal styling.",
    price: "£180",
    duration: "Package",
  },
  {
    name: "Bridal Frontal Installation & Styling",
    description: "Frontal installation with bridal styling.",
    price: "£300",
    duration: "Package",
  },
  {
    name: "Bridal Makeup + Hair Styling (Traditional)",
    description: "Traditional bridal makeup with hair styling.",
    price: "£550",
    duration: "Package",
  },
  {
    name: "Bridal Makeup + Hair Installation & Styling",
    description: "Bridal makeup with hair installation and styling.",
    price: "£540",
    duration: "Package",
  },
  {
    name: "Bride’s Gele (One Style)",
    description: "Gele styling for the bride.",
    price: "£60",
    duration: "One style",
  },
];

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
          Makeup, hair styling, and bridal packages with clear, published
          rates.
        </p>
      </motion.section>

      <section className={styles.list}>
        {services.map((service) => (
          <motion.article
            key={service.name}
            className={styles.card}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.4 },
                  transition: { duration: 0.7, ease: "easeOut" },
                })}
            whileHover={reduceMotion ? undefined : { y: -6 }}
          >
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{service.name}</h2>
              <p className={styles.cardText}>{service.description}</p>
            </div>
            <div className={styles.cardMeta}>
              <span>{service.price}</span>
              <span>{service.duration}</span>
            </div>
            <Link
              href="/book/service"
              className={styles.cardLink}
            >
              Book this service
            </Link>
            <div className={styles.cardDivider} />
          </motion.article>
        ))}
      </section>
    </main>
  );
}
