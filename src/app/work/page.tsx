// Editorial portfolio page.
import Image from "next/image";

const portfolio = [
  {
    src: "/images/work-1.svg",
    alt: "Editorial beauty portrait with soft glow",
    title: "Modern Glow",
  },
  {
    src: "/images/work-2.svg",
    alt: "Neutral bridal makeup with satin skin",
    title: "Bridal Satin",
  },
  {
    src: "/images/work-3.svg",
    alt: "Studio portrait with muted tones",
    title: "Muted Studio",
  },
  {
    src: "/images/work-4.svg",
    alt: "Evening look with sculpted cheeks",
    title: "Evening Sculpture",
  },
  {
    src: "/images/work-5.svg",
    alt: "Fashion week makeup detail",
    title: "Runway Detail",
  },
  {
    src: "/images/work-6.svg",
    alt: "Soft-focus campaign beauty portrait",
    title: "Soft Focus",
  },
];

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Portfolio
          </p>
          <h1>Selected work across bridal and editorial.</h1>
        </div>
        <p className="text-lg text-stone-600">
          A curated edit of recent commissions, from private weddings to
          campaign-led studio sessions. Each look is built for real life and
          refined photography.
        </p>
      </div>

      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.map((item) => (
          <figure key={item.title} className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-stone-200">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              />
            </div>
            <figcaption className="text-sm uppercase tracking-[0.3em] text-stone-500">
              {item.title}
            </figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}
