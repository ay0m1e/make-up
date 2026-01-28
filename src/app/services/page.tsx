// Services listing with editorial cards.
import Link from "next/link";

const services = [
  {
    name: "Bridal Atelier",
    description:
      "A refined bridal session with skin preparation, soft sculpting, and veil-ready longevity.",
    price: "$650",
    duration: "120 minutes",
  },
  {
    name: "Wedding Party",
    description:
      "Coordinated makeup for the wedding party with a cohesive, polished finish.",
    price: "$180",
    duration: "60 minutes",
  },
  {
    name: "Editorial Session",
    description:
      "On-set artistry for campaigns, studio sessions, and press appearances.",
    price: "$900",
    duration: "180 minutes",
  },
  {
    name: "Event Glam",
    description:
      "Camera-ready makeup for gala evenings, premieres, and private celebrations.",
    price: "$320",
    duration: "75 minutes",
  },
  {
    name: "Private Lesson",
    description:
      "A personalized lesson focused on technique, product curation, and routine.",
    price: "$420",
    duration: "90 minutes",
  },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-12">
      <section className="space-y-3">
        <h1>Services</h1>
        <p className="text-base text-stone-600">
          A calm, curated menu of luxury makeup appointments for bridal,
          editorial, and private clients.
        </p>
      </section>

      <section className="mt-16 space-y-16">
        {services.map((service) => (
          <article key={service.name} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl text-stone-900">{service.name}</h2>
              <p className="text-base text-stone-600">{service.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.35em] text-stone-500">
              <span>{service.price}</span>
              <span>{service.duration}</span>
            </div>
            <Link
              href="/book/service"
              className="inline-flex rounded-full border border-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
            >
              Book this service
            </Link>
            <div className="h-px w-full bg-stone-200/40" />
          </article>
        ))}
      </section>
    </main>
  );
}
