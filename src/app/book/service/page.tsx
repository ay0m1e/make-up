// Booking step 1: select a service from the backend.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceCard } from "../../../components/ServiceCard";
import { getServices } from "../../../core/api/services";
import { startBooking } from "../../../core/booking/store";
import type { Service } from "../../../core/types";
import styles from "../flow.module.css";

export default function BookServicePage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadServices() {
      setLoading(true);
      setError(null);

      try {
        const nextServices = await getServices();
        if (!active) {
          return;
        }
        setServices(nextServices);
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Unable to load services.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      active = false;
    };
  }, []);

  function handleSelect(service: Service) {
    startBooking(service);
    router.push("/book/date");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Step 1 of 5</p>
          <h1>Select your service</h1>
          <p className={styles.subtext}>
            Choose the service you want to test through the booking flow.
          </p>
        </header>

        {loading ? <p className={styles.loadingState}>Loading available services...</p> : null}

        {error ? (
          <div className={styles.errorBox}>
            <p>{error}</p>
          </div>
        ) : null}

        {!loading && !error ? (
          <section className={styles.list}>
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                className={styles.serviceButton}
                onClick={() => handleSelect(service)}
              >
                <ServiceCard
                  service={service}
                  imageAlt={`${service.name} service preview`}
                  category={service.category ?? undefined}
                />
              </button>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
