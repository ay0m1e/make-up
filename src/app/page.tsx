// Homepage for the luxury makeup artist studio.
import Image from "next/image";
import Link from "next/link";

const editorialImages = [
  { src: "/images/work-1.svg", alt: "Editorial beauty portrait in soft light" },
  { src: "/images/work-2.svg", alt: "Warm bridal look with luminous skin" },
  { src: "/images/work-3.svg", alt: "Studio portrait with neutral tones" },
  { src: "/images/work-4.svg", alt: "Evening makeup with refined glow" },
  { src: "/images/work-5.svg", alt: "Campaign portrait with sculpted finish" },
  { src: "/images/work-6.svg", alt: "Soft glam close-up with satin skin" },
];

export default function HomePage() {
  return (
    <main className="bg-stone-50">
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/custom/hero.svg"
            alt="Luxury makeup artistry portrait"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-stone-900/45" />
        </div>
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-end px-6 pb-16 pt-24 lg:px-12">
          <div className="max-w-xl space-y-5 text-stone-50">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-200">
              Liora Atelier
            </p>
            <h1 className="text-stone-50">
              Luminous, editorial makeup for modern brides and refined events.
            </h1>
            <p className="text-base text-stone-200">
              Soft structure. Calm presence. Long-wear elegance.
            </p>
            <Link
              href="/book/service"
              className="inline-flex rounded-full border border-stone-100 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-50 transition hover:bg-stone-50 hover:text-stone-900"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-12">
        <div className="grid gap-8 md:grid-cols-12 md:auto-rows-[220px] lg:auto-rows-[260px]">
          {editorialImages.map((image, index) => {
            const spans = [
              "md:col-span-7 md:row-span-2",
              "md:col-span-5 md:row-span-1",
              "md:col-span-5 md:row-span-2",
              "md:col-span-7 md:row-span-1",
              "md:col-span-6 md:row-span-2",
              "md:col-span-6 md:row-span-1",
            ];

            return (
              <div
                key={image.src}
                className={`relative overflow-hidden rounded-[28px] bg-stone-200 ${spans[index]}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 pb-24 lg:px-12">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Studio Assurance
          </p>
          <h2>Beauty delivered with calm precision.</h2>
          <p className="text-base text-stone-600">
            A decade of bridal and editorial experience, executed with
            discretion, timing, and care.
          </p>
        </div>
      </section>

      <section className="bg-stone-100">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center lg:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Begin the experience
          </p>
          <h2>Reserve your appointment.</h2>
          <p className="text-base text-stone-600">
            Share your date and details for a tailored beauty plan.
          </p>
          <Link
            href="/book/service"
            className="rounded-full border border-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
