// Booking step 1: select a service from the backend.
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ServiceCard } from "../../../components/ServiceCard";
import { getServices } from "../../../core/api/services";
import { startBooking } from "../../../core/booking/store";
import type { Service } from "../../../core/types";
import {
  SERVICE_CATEGORY_ORDER,
  getServiceCategoryHeading,
  normalizeServiceCategory,
} from "../../../lib/service-categories";
import styles from "../flow.module.css";

export default function BookServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categoryParam = searchParams.get("category");
  const selectedCategory = useMemo(
    () => normalizeServiceCategory(categoryParam),
    [categoryParam],
  );
  const hasCategoryParam = categoryParam !== null;

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
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load services right now. Please refresh and try again.",
        );
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

  const groupedServices = useMemo(() => {
    const groups = new Map<string, Service[]>();
    const visibleServices = selectedCategory
      ? services.filter(
          (service) => getServiceCategoryHeading(service) === selectedCategory,
        )
      : services;

    SERVICE_CATEGORY_ORDER.forEach((heading) => {
      groups.set(heading, []);
    });

    visibleServices.forEach((service) => {
      const heading = getServiceCategoryHeading(service);
      groups.set(heading, [...(groups.get(heading) ?? []), service]);
    });

    return SERVICE_CATEGORY_ORDER.map((heading) => ({
      heading,
      services: groups.get(heading) ?? [],
    })).filter((group) => group.services.length > 0);
  }, [selectedCategory, services]);

  const selectedGroup = selectedCategory
    ? groupedServices.find((group) => group.heading === selectedCategory) ?? null
    : null;

  function handleSelect(service: Service) {
    startBooking(service);
    router.push("/book/date");
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Step 1 of 5</p>
          <h1>{selectedCategory ?? "Select your service"}</h1>
          <p className={styles.subtext}>
            {selectedCategory
              ? "Choose the service you want to book in this category."
              : "Choose the service you want to test through the booking flow."}
          </p>
          {selectedCategory ? (
            <div className={styles.headerActions}>
              <Link href="/services" className={styles.linkButton}>
                Back to categories
              </Link>
            </div>
          ) : null}
        </header>

        {loading ? <p className={styles.loadingState}>Loading available services...</p> : null}

        {error ? (
          <div className={styles.errorBox}>
            <p>{error}</p>
          </div>
        ) : null}

        {!loading && !error && hasCategoryParam && !selectedCategory ? (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>Choose a service category first</p>
            <p className={styles.helperText}>
              Start from the services page to browse categories, then continue
              into the booking flow.
            </p>
            <div className={styles.headerActions}>
              <Link href="/services" className={styles.linkButton}>
                View service categories
              </Link>
            </div>
          </div>
        ) : null}

        {!loading && !error && selectedCategory && selectedGroup?.services.length ? (
          <div className={styles.list}>
            {selectedGroup.services.map((service) => (
              <button
                key={service.id}
                type="button"
                className={styles.serviceButton}
                onClick={() => handleSelect(service)}
              >
                <ServiceCard service={service} />
              </button>
            ))}
          </div>
        ) : null}

        {!loading && !error && selectedCategory && !selectedGroup?.services.length ? (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>No services found in this category</p>
            <p className={styles.helperText}>
              Choose another category to continue with your booking.
            </p>
            <div className={styles.headerActions}>
              <Link href="/services" className={styles.linkButton}>
                Back to categories
              </Link>
            </div>
          </div>
        ) : null}

        {!loading && !error && !selectedCategory && !hasCategoryParam ? (
          <div className={styles.categorySections}>
            {groupedServices.map((group) => (
              <section key={group.heading} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{group.heading}</h2>
                </div>

                <div className={styles.list}>
                  {group.services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      className={styles.serviceButton}
                      onClick={() => handleSelect(service)}
                    >
                      <ServiceCard service={service} />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
