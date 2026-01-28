// Biography page for the makeup artist.
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-12">
      <section className="grid gap-12 lg:grid-cols-[0.5fr_0.5fr] lg:items-center">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] bg-stone-200">
          <Image
            src="/images/hero-2.svg"
            alt="Portrait of the makeup artist"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 35vw, 100vw"
            priority
          />
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            About
          </p>
          <h1>Elena Maris</h1>
          <p className="text-base text-stone-600">
            Bridal and editorial makeup artist based in New York, known for
            luminous skin and quietly confident finishes.
          </p>
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <h2>Biography</h2>
        <div className="space-y-4 text-stone-600">
          <p>
            Elena has spent more than a decade shaping beauty for weddings,
            fashion editorials, and private events. Her work is known for
            skin-first prep, soft structure, and an understated, modern finish.
          </p>
          <p>
            Each appointment is paced with care, allowing space for calm,
            thoughtful detail. She listens closely, refines every texture, and
            ensures each client feels both seen and beautifully at ease.
          </p>
          <p>
            From intimate ceremonies to campaign-led studio sessions, Elena
            brings professionalism, discretion, and a warm, confident presence.
          </p>
        </div>
      </section>

      <section className="mt-16 space-y-4 rounded-[28px] bg-white px-8 py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Credentials
        </p>
        <div className="grid gap-4 text-sm text-stone-600 sm:grid-cols-2">
          <p>12+ years in luxury beauty and editorial work</p>
          <p>Bridal, fashion, and private event clientele</p>
          <p>Specialty in luminous skin and soft structure</p>
          <p>Available for destination weddings worldwide</p>
        </div>
      </section>

      <section className="mt-16 flex flex-col items-center gap-6 rounded-[28px] bg-stone-100 px-8 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Begin the experience
        </p>
        <h2>Book a private appointment with Elena.</h2>
        <p className="text-base text-stone-600">
          Share your date and details for a personalized makeup experience.
        </p>
        <Link
          href="/book/service"
          className="rounded-full border border-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
        >
          Book an Appointment
        </Link>
      </section>
    </main>
  );
}
