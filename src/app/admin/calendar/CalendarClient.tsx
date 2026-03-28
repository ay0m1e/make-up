"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminBookings } from "../../../core/api/admin";
import type { AdminBooking } from "../../../core/types";
import { formatBookingTime } from "../../../lib/booking-format";
import styles from "../admin.module.css";

function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const parts = error.message.split(" - ");
  return parts.length > 1 ? parts[parts.length - 1] : error.message;
}

function getStatusClass(status: string) {
  switch (status) {
    case "pending":
      return styles.statusPending;
    case "confirmed":
      return styles.statusConfirmed;
    case "cancelled":
      return styles.statusCancelled;
    case "deposit_paid":
      return styles.statusDepositPaid;
    case "awaiting_transfer":
      return styles.statusAwaitingTransfer;
    default:
      return styles.statusPending;
  }
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date: Date) {
  const next = startOfDay(date);
  const offset = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - offset);
  return next;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getWeekDifference(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getBookingDay(booking: AdminBooking) {
  return startOfDay(new Date(`${booking.booking_date}T00:00:00`));
}

function getBookingStart(booking: AdminBooking) {
  return new Date(`${booking.booking_date}T${booking.start_time}`);
}

function formatWeekRange(start: Date, end: Date) {
  const startFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  });
  const endFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${startFormatter.format(start)} - ${endFormatter.format(end)}`;
}

const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

type DayColumn = {
  key: string;
  date: Date;
  bookings: AdminBooking[];
};

export function CalendarClient() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [initialWeekAligned, setInitialWeekAligned] = useState(false);
  const [showingPastFallback, setShowingPastFallback] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const todayKey = useMemo(() => formatDateKey(today), [today]);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      setLoading(true);
      setError(null);
      setInitialWeekAligned(false);

      try {
        const response = await getAdminBookings({
          page: 1,
          per_page: 100,
        });

        if (!active) {
          return;
        }

        const sorted = response
          .slice()
          .sort((left, right) => getBookingStart(left).getTime() - getBookingStart(right).getTime());

        const upcoming = sorted
          .filter((booking) => getBookingStart(booking).getTime() >= today.getTime())
          .sort((left, right) => getBookingStart(left).getTime() - getBookingStart(right).getTime());

        setShowingPastFallback(upcoming.length === 0 && sorted.length > 0);
        setBookings(upcoming.length > 0 ? upcoming : sorted);
      } catch (loadError) {
        if (!active) {
          return;
        }

        const rawMessage = loadError instanceof Error ? loadError.message : "";
        const message = getErrorMessage(loadError, "Unable to load calendar.");
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

    loadBookings();

    return () => {
      active = false;
    };
  }, [router, today]);

  const weekStart = useMemo(() => addDays(startOfWeek(today), weekOffset * 7), [today, weekOffset]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const currentWeek = useMemo(() => startOfWeek(today), [today]);

  const columns = useMemo<DayColumn[]>(() => {
    const bookingsByDate = new Map<string, AdminBooking[]>();

    bookings.forEach((booking) => {
      const bookingDay = getBookingDay(booking);
      if (bookingDay.getTime() < weekStart.getTime() || bookingDay.getTime() > weekEnd.getTime()) {
        return;
      }

      const dateKey = formatDateKey(bookingDay);
      const current = bookingsByDate.get(dateKey) ?? [];
      current.push(booking);
      bookingsByDate.set(dateKey, current);
    });

    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const key = formatDateKey(date);
      const dayBookings = bookingsByDate.get(key) ?? [];

      return {
        key,
        date,
        bookings: dayBookings,
      };
    });
  }, [bookings, weekEnd, weekStart]);

  useEffect(() => {
    if (loading || initialWeekAligned) {
      return;
    }

    if (bookings.length === 0) {
      setInitialWeekAligned(true);
      return;
    }

    const targetBooking = showingPastFallback ? bookings[bookings.length - 1] : bookings[0];
    const targetWeek = startOfWeek(getBookingStart(targetBooking));
    const nextOffset = getWeekDifference(currentWeek, targetWeek);

    setWeekOffset(nextOffset);
    setInitialWeekAligned(true);
  }, [bookings, currentWeek, initialWeekAligned, loading, showingPastFallback]);

  const visibleBookingCount = useMemo(
    () => columns.reduce((total, column) => total + column.bookings.length, 0),
    [columns],
  );

  const minWeekOffset = useMemo(() => {
    if (bookings.length === 0) {
      return 0;
    }
    return getWeekDifference(currentWeek, startOfWeek(getBookingStart(bookings[0])));
  }, [bookings, currentWeek]);

  const maxWeekOffset = useMemo(() => {
    if (bookings.length === 0) {
      return 0;
    }
    return getWeekDifference(
      currentWeek,
      startOfWeek(getBookingStart(bookings[bookings.length - 1])),
    );
  }, [bookings, currentWeek]);

  return (
    <div className={styles.shell}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.eyebrow}>Calendar</p>
          <p className={styles.count}>
            {loading
              ? "Loading schedule..."
              : showingPastFallback
                ? `No future bookings. Showing ${bookings.length} existing booking(s)`
                : `${bookings.length} upcoming booking(s)`}
          </p>
        </div>

        <div className={styles.calendarControls}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setWeekOffset((current) => current - 1)}
            disabled={weekOffset <= minWeekOffset}
          >
            Previous week
          </button>
          <div className={styles.calendarRange}>{formatWeekRange(weekStart, weekEnd)}</div>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setWeekOffset((current) => current + 1)}
            disabled={weekOffset >= maxWeekOffset}
          >
            Next week
          </button>
        </div>
      </div>

      {error ? (
        <div className={styles.errorBox}>
          <p>{error}</p>
        </div>
      ) : null}

      {loading ? <div className={styles.card}>Loading calendar...</div> : null}

      {!loading && bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No upcoming bookings found.</p>
        </div>
      ) : null}

      {!loading && bookings.length > 0 ? (
        <>
          {showingPastFallback ? (
            <div className={styles.card}>
              <p className={styles.calendarEmpty}>
                No future bookings were found, so this view is showing your existing bookings by week.
              </p>
            </div>
          ) : null}

          {visibleBookingCount === 0 ? (
            <div className={styles.card}>
              <p className={styles.calendarEmpty}>
                No bookings fall in this week. Move to another week to view scheduled bookings.
              </p>
            </div>
          ) : null}

          <section className={styles.calendarGrid} aria-label="Upcoming bookings calendar">
            {columns.map((column) => {
              const isToday = column.key === todayKey;
              const bookingCount = column.bookings.length;

              return (
                <article
                  key={column.key}
                  className={`${styles.calendarDay} ${isToday ? styles.calendarDayToday : ""}`}
                >
                  <div className={styles.calendarDayHeader}>
                    <p className={styles.calendarDayLabel}>{DAY_LABEL_FORMATTER.format(column.date)}</p>
                    <p className={styles.calendarDayMeta}>
                      {bookingCount === 0
                        ? "No bookings"
                        : `${bookingCount} booking${bookingCount === 1 ? "" : "s"}`}
                    </p>
                  </div>

                  {bookingCount > 0 ? (
                    <div className={styles.calendarEventList}>
                      {column.bookings.map((booking) => (
                        <div key={booking.id} className={styles.calendarEvent}>
                          <div className={styles.calendarEventTop}>
                            <span className={styles.calendarEventTime}>
                              {formatBookingTime(booking.start_time)}
                            </span>
                          </div>
                          <p className={styles.calendarEventName}>{booking.customer.name}</p>
                          <p className={styles.calendarEventMeta}>
                            {booking.service.name ?? "Unknown service"}
                          </p>
                          <div className={styles.calendarEventStatuses}>
                            <span
                              className={`${styles.statusPill} ${getStatusClass(booking.booking_status)}`}
                            >
                              {booking.booking_status.replaceAll("_", " ")}
                            </span>
                            <span
                              className={`${styles.statusPill} ${getStatusClass(booking.payment_status)}`}
                            >
                              {booking.payment_status.replaceAll("_", " ")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.calendarEmpty}>Free for the day.</p>
                  )}
                </article>
              );
            })}
          </section>
        </>
      ) : null}
    </div>
  );
}
