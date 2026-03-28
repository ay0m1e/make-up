// Presentational card for a service offering.
import type { Service } from "../core/types";
import { formatPence } from "../lib/money";
import styles from "./ServiceCard.module.css";

type Props = {
  service: Service;
  category?: string;
};

export function ServiceCard({ service, category }: Props) {
  return (
    <article className={styles.card}>
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
          <span>From {formatPence(service.price_pence)}</span>
        </div>
      </div>
    </article>
  );
}
