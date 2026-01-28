// Booking step 1: select a service.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const serviceChoices = [
  { id: "bridal-atelier", name: "Bridal Atelier", price: "$650", duration: "120 minutes" },
  { id: "event-glam", name: "Event Glam", price: "$320", duration: "75 minutes" },
  { id: "editorial-session", name: "Editorial Session", price: "$900", duration: "180 minutes" },
  { id: "private-lesson", name: "Private Lesson", price: "$420", duration: "90 minutes" },
];

export default function BookServicePage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedService = serviceChoices.find((service) => service.id === selectedId);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
          Step 1 of 4
        </p>
        <h1>Select your service</h1>
        <p className="text-sm text-stone-600">Choose one to continue.</p>
      </div>

      <section className="mt-12 grid gap-4">
        {serviceChoices.map((service) => {
          const isSelected = service.id === selectedId;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedId(service.id)}
              className={`w-full rounded-[26px] px-7 py-7 text-left transition ${
                isSelected
                  ? "border border-stone-900 bg-stone-100"
                  : "border border-stone-200 bg-white hover:border-stone-400"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-2xl text-stone-900">{service.name}</h2>
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                    {service.duration}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  {service.price}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      {selectedService ? (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <p className="text-sm text-stone-600">
            Selected: <span className="text-stone-900">{selectedService.name}</span>
          </p>
          <button
            type="button"
            onClick={() => router.push("/book/date")}
            className="rounded-full border border-stone-900 px-6 py-3 text-xs uppercase tracking-[0.3em] text-stone-900 transition hover:bg-stone-900 hover:text-stone-50"
          >
            Continue
          </button>
        </div>
      ) : null}
    </main>
  );
}
