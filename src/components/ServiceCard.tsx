// Presentational card for a service offering.
import Image from "next/image";
import type { Service } from "../core/types";
import { placeholderImage } from "../media";
import styles from "./ServiceCard.module.css";

type Props = {
  service: Service;
  imageAlt: string;
  category?: string;
};

export function ServiceCard({ service, imageAlt, category }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={placeholderImage}
          alt={imageAlt}
          fill
          className={styles.image}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className={styles.body}>
        {category ? (
          <p className={styles.category}>
            {category}
          </p>
        ) : null}
        <div className={styles.content}>
          <h3 className={styles.title}>{service.name}</h3>
          {service.description ? (
            <p className={styles.description}>{service.description}</p>
          ) : null}
        </div>
        <div className={styles.meta}>
          <span>{service.duration_minutes} minutes</span>
          <span>From £{service.price}</span>
        </div>
      </div>
    </article>
  );
}
