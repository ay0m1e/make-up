"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAdminService,
  deactivateAdminService,
  getAdminServices,
  updateAdminService,
} from "../../../core/api/admin";
import type { AdminServicePayload, Service } from "../../../core/types";
import { formatPence } from "../../../lib/money";
import styles from "../admin.module.css";

const EMPTY_FORM: AdminServicePayload = {
  name: "",
  description: "",
  price_pence: 0,
  duration_minutes: 60,
  category: "",
  is_active: true,
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const parts = error.message.split(" - ");
  return parts.length > 1 ? parts[parts.length - 1] : error.message;
}

export function ServicesClient() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<AdminServicePayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadServices() {
      setLoading(true);
      setError(null);

      try {
        const response = await getAdminServices();
        if (!active) {
          return;
        }
        setServices(response);
      } catch (loadError) {
        if (!active) {
          return;
        }
        const rawMessage = loadError instanceof Error ? loadError.message : "";
        const message = getErrorMessage(loadError, "Unable to load services.");
        if (rawMessage.includes("401")) {
          router.replace("/admin/login");
          return;
        }
        setError(message);
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
  }, [router]);

  const heading = useMemo(
    () => (editingId ? "Edit service" : "Add service"),
    [editingId],
  );

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description ?? "",
      price_pence: service.price_pence,
      duration_minutes: service.duration_minutes,
      category: service.category ?? "",
      is_active: service.is_active,
    });
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: AdminServicePayload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      price_pence: Number(form.price_pence),
      duration_minutes: Number(form.duration_minutes),
      category: form.category?.trim() || null,
      is_active: form.is_active ?? true,
    };

    try {
      if (editingId) {
        const updated = await updateAdminService(editingId, payload);
        setServices((current) =>
          current.map((service) => (service.id === editingId ? updated : service)),
        );
      } else {
        const created = await createAdminService(payload);
        setServices((current) => [created, ...current]);
      }
      resetForm();
    } catch (submitError) {
      const rawMessage = submitError instanceof Error ? submitError.message : "";
      const message = getErrorMessage(submitError, "Unable to save service.");
      if (rawMessage.includes("401")) {
        router.replace("/admin/login");
        return;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(serviceId: string) {
    setActionId(serviceId);
    setError(null);

    try {
      await deactivateAdminService(serviceId);
      setServices((current) =>
        current.map((service) =>
          service.id === serviceId ? { ...service, is_active: false } : service,
        ),
      );
      if (editingId === serviceId) {
        resetForm();
      }
    } catch (actionError) {
      const rawMessage = actionError instanceof Error ? actionError.message : "";
      const message = getErrorMessage(actionError, "Unable to deactivate service.");
      if (rawMessage.includes("401")) {
        router.replace("/admin/login");
        return;
      }
      setError(message);
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className={styles.servicesLayout}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Services</p>
          <h2>{heading}</h2>
          <p className={styles.subtext}>
            Create new services, update active service details, or deactivate them when needed.
          </p>
        </div>

        <form className={styles.serviceForm} onSubmit={handleSubmit}>
          <div className={styles.serviceGrid}>
            <div className={styles.field}>
              <label htmlFor="service-name" className={styles.label}>
                Name
              </label>
              <input
                id="service-name"
                className={styles.input}
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="service-category" className={styles.label}>
                Category
              </label>
              <input
                id="service-category"
                className={styles.input}
                value={form.category ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="service-price" className={styles.label}>
                Price (pence)
              </label>
              <input
                id="service-price"
                type="number"
                min="0"
                className={styles.input}
                value={form.price_pence}
                onChange={(event) =>
                  setForm((current) => ({ ...current, price_pence: Number(event.target.value) }))
                }
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="service-duration" className={styles.label}>
                Duration (minutes)
              </label>
              <input
                id="service-duration"
                type="number"
                min="1"
                className={styles.input}
                value={form.duration_minutes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, duration_minutes: Number(event.target.value) }))
                }
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="service-description" className={styles.label}>
              Description
            </label>
            <textarea
              id="service-description"
              className={styles.input}
              value={form.description ?? ""}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              rows={4}
            />
          </div>

          {error ? (
            <div className={styles.errorBox}>
              <p>{error}</p>
            </div>
          ) : null}

          <div className={styles.serviceActions}>
            <button type="submit" className={styles.primaryButton} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update service" : "Add service"}
            </button>
            {editingId ? (
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={resetForm}
                disabled={saving}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className={styles.list}>
        {loading ? <div className={styles.card}>Loading services...</div> : null}

        {!loading && services.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No services returned by the API.</p>
          </div>
        ) : null}

        {!loading &&
          services.map((service) => (
            <article key={service.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div>
                  <h2 className={styles.reference}>{service.name}</h2>
                  <p className={styles.customer}>
                    {service.category || "Uncategorised"} · {formatPence(service.price_pence)}
                  </p>
                </div>
                <div className={styles.statusRow}>
                  <span className={`${styles.statusPill} ${styles.statusConfirmed}`}>
                    {service.duration_minutes} min
                  </span>
                  <span
                    className={`${styles.statusPill} ${
                      service.is_active ? styles.statusConfirmed : styles.statusInactive
                    }`}
                  >
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {service.description ? <p className={styles.mutedText}>{service.description}</p> : null}

              <div className={styles.serviceActions}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => startEdit(service)}
                >
                  Edit service
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => handleDeactivate(service.id)}
                  disabled={actionId === service.id || !service.is_active}
                >
                  {actionId === service.id ? "Saving..." : "Deactivate"}
                </button>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
