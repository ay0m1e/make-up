// Booking step 3: choose a time window.
import Image from "next/image";
import Link from "next/link";
import { TimeSlot } from "../../../components/TimeSlot";

const timeOptions = [
  { label: "8:00 AM", note: "Early start" },
  { label: "10:30 AM", note: "Morning" },
  { label: "1:00 PM", note: "Midday" },
  { label: "3:30 PM", note: "Afternoon" },
  { label: "6:00 PM", note: "Evening" },
  { label: "7:30 PM", note: "Late" },
];

export default function BookTimePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Step 3 of 4
        </p>
        <h1>Select a time window</h1>
        <p className="text-lg text-stone-600">
          These time windows help the studio confirm travel and prep time for
          your appointment.
        </p>
      </div>

      <section className="mt-10 grid gap-10 lg:grid-cols-[0.65fr_0.35fr] lg:items-start">
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {timeOptions.map((option) => (
              <TimeSlot
                key={option.label}
                label={option.label}
                note={option.note}
              />
            ))}
          </div>
          <Link
            href="/book/payment"
            className="inline-flex items-center rounded-full bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-50 transition hover:bg-stone-800"
          >
            Continue to details
          </Link>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-stone-200">
          <Image
            src="/images/booking-2.svg"
            alt="Soft makeup palette with neutral tones"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 28vw, 100vw"
          />
        </div>
      </section>
    </main>
  );
}
