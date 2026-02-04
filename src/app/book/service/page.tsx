// Booking step 1: select a service.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const serviceChoices = [
  { id: "bridal-atelier", name: "Bridal Atelier", price: "$650", duration: "120 minutes" },
  { id: "event-glam", name: "Event Glam", price: "$320", duration: "75 minutes" },
  { id: "editorial-session", name: "Editorial Session", price: "$900", duration: "180 minutes" },
  { id: "private-lesson", name: "Private Lesson", price: "$420", duration: "90 minutes" },
];

export default function BookServicePage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedService = serviceChoices.find((service) => service.id === selectedId);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Step 1 of 4</p>
        <h1>Select your service</h1>
        <p className={styles.subtext}>Choose one to continue.</p>
      </div>

      <section className={styles.list}>
        {serviceChoices.map((service) => {
          const isSelected = service.id === selectedId;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedId(service.id)}
              className={`${styles.card} ${
                isSelected ? styles.cardSelected : styles.cardDefault
              }`}
            >
              <div className={styles.cardRow}>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{service.name}</h2>
                  <p className={styles.cardMeta}>
                    {service.duration}
                  </p>
                </div>
                <p className={styles.cardMeta}>
                  {service.price}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      {selectedService ? (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Selected: <span className={styles.footerName}>{selectedService.name}</span>
          </p>
          <button
            type="button"
            onClick={() => router.push("/book/date")}
            className={styles.continueButton}
          >
            Continue
          </button>
        </div>
      ) : null}
    </main>
  );
}
