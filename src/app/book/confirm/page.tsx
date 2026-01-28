// Booking confirmation page.
import Image from "next/image";
import Link from "next/link";

export default function BookConfirmPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-20 lg:px-12">
      <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center">
        <div className="mx-auto mb-8 h-40 w-40 overflow-hidden rounded-full bg-stone-200">
          <Image
            src="/images/booking-4.svg"
            alt="Soft makeup kit detail"
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Request received
        </p>
        <h1 className="mt-4">Your booking request is confirmed.</h1>
        <p className="mt-4 text-lg text-stone-600">
          The studio will review your details and respond within two business
          days with a tailored proposal and next steps.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/work"
            className="rounded-full border border-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
          >
            View the portfolio
          </Link>
          <Link
            href="/"
            className="rounded-full bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-50 transition hover:bg-stone-800"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
