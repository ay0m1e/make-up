// Booking step 2: choose a date.
import Image from "next/image";
import Link from "next/link";
import { DatePicker } from "../../../components/DatePicker";

const dateOptions = [
  "Tuesday, March 12 - Morning",
  "Wednesday, March 13 - Afternoon",
  "Friday, March 15 - Morning",
  "Saturday, March 16 - Afternoon",
  "Tuesday, March 19 - Morning",
  "Thursday, March 21 - Afternoon",
];

export default function BookDatePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Step 2 of 4
        </p>
        <h1>Select a preferred date</h1>
        <p className="text-lg text-stone-600">
          Share your preferred windows and the studio will confirm the final
          timing with you.
        </p>
      </div>

      <section className="mt-10 grid gap-10 lg:grid-cols-[0.65fr_0.35fr] lg:items-start">
        <div className="space-y-8">
          <DatePicker dates={dateOptions} />
          <Link
            href="/book/time"
            className="inline-flex items-center rounded-full bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-50 transition hover:bg-stone-800"
          >
            Continue to time
          </Link>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-stone-200">
          <Image
            src="/images/booking-1.svg"
            alt="Makeup brushes laid out for a session"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 28vw, 100vw"
          />
        </div>
      </section>
    </main>
  );
}
