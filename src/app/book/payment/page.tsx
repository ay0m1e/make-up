// Booking step 4: share details (no payment processing yet).
import Image from "next/image";
import Link from "next/link";

export default function BookPaymentPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Step 4 of 4
        </p>
        <h1>Share your details</h1>
        <p className="text-lg text-stone-600">
          Provide a few details so the studio can confirm your appointment and
          send the final proposal.
        </p>
      </div>

      <section className="mt-10 grid gap-10 lg:grid-cols-[0.6fr_0.4fr]">
        <form className="grid gap-6 rounded-3xl border border-stone-200 bg-white p-8">
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Full name
            </label>
            <input
              type="text"
              placeholder="Alexandra Monroe"
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Email
            </label>
            <input
              type="email"
              placeholder="alexandra@email.com"
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Event location
            </label>
            <input
              type="text"
              placeholder="The Wythe Hotel, Brooklyn"
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Notes for the artist
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about your vision, inspiration, or timeline."
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm focus:border-stone-400 focus:outline-none"
            />
          </div>
          <Link
            href="/book/confirm"
            className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-50 transition hover:bg-stone-800"
          >
            Submit request
          </Link>
        </form>

        <aside className="space-y-6 rounded-3xl border border-stone-200 bg-white p-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200">
            <Image
              src="/images/booking-3.svg"
              alt="Soft lighting with makeup tools on a vanity"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 25vw, 100vw"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Appointment
            </p>
            <p className="text-lg font-serif text-stone-900">
              Bridal Atelier
            </p>
            <p className="text-sm text-stone-600">
              Two-hour bridal appointment with soft, luminous finish.
            </p>
          </div>
          <div className="space-y-2 text-sm text-stone-600">
            <p>Date window: March 16, Afternoon</p>
            <p>Time window: 1:00 PM</p>
            <p>Estimated investment: From $650</p>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Deposits and contracts are shared after confirmation.
          </p>
        </aside>
      </section>
    </main>
  );
}
