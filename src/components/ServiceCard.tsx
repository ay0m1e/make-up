// Presentational card for a service offering.
import Image from "next/image";
import type { Service } from "../core/types";

type Props = {
  service: Service;
  imageSrc: string;
  imageAlt: string;
  category?: string;
};

export function ServiceCard({ service, imageSrc, imageAlt, category }: Props) {
  return (
    <article className="group grid gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="space-y-3">
        {category ? (
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            {category}
          </p>
        ) : null}
        <div className="space-y-2">
          <h3 className="text-2xl text-stone-900">{service.name}</h3>
          {service.description ? (
            <p className="text-sm text-stone-600">{service.description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.25em] text-stone-500">
          <span>{service.duration_minutes} minutes</span>
          <span>From ${service.price}</span>
        </div>
      </div>
    </article>
  );
}
