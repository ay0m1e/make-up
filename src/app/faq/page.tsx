// Frequently asked questions.
import Image from "next/image";
const faqs = [
  {
    question: "How far in advance should I book?",
    answer:
      "For weddings, booking 6-9 months in advance is recommended. Editorial and event appointments typically book 4-6 weeks ahead, depending on season.",
  },
  {
    question: "Do you offer touch-ups during events?",
    answer:
      "Touch-up coverage can be added for weddings and long events. The studio will share options and timing once your date is confirmed.",
  },
  {
    question: "What products do you use?",
    answer:
      "The kit includes luxury and professional-grade products selected for camera-ready finishes and long wear, customized to your skin needs.",
  },
  {
    question: "Do you travel?",
    answer:
      "Yes. Liora Atelier is based in New York and available for destination weddings and editorial travel worldwide.",
  },
  {
    question: "Can I schedule a trial?",
    answer:
      "Bridal trials are available and recommended. They can be scheduled once your wedding date is confirmed.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[0.6fr_0.4fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            FAQ
          </p>
          <h1>Answers for a calm, confident booking.</h1>
          <p className="text-lg text-stone-600">
            The most common questions from brides, clients, and creative teams.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200">
          <Image
            src="/images/editorial-1.svg"
            alt="Soft portrait with neutral tones"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 30vw, 100vw"
          />
        </div>
      </div>

      <section className="mt-12 space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-3xl border border-stone-200 bg-white p-8"
          >
            <h3 className="text-xl text-stone-900">{faq.question}</h3>
            <p className="mt-3 text-sm text-stone-600">{faq.answer}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
