// Presentational time slot button (no selection logic).
import styles from "./TimeSlot.module.css";

type Props = {
  label: string;
  note?: string;
};

export function TimeSlot({ label, note }: Props) {
  return (
    <button type="button" className={styles.button}>
      <span className={styles.label}>{label}</span>
      {note ? <span className={styles.note}>{note}</span> : null}
    </button>
  );
}
