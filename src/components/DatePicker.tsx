// Presentational date picker list (no selection logic).
import styles from "./DatePicker.module.css";

type Props = {
  dates: string[];
};

export function DatePicker({ dates }: Props) {
  return (
    <div className={styles.grid}>
      {dates.map((date) => (
        <button key={date} type="button" className={styles.button}>
          {date}
        </button>
      ))}
    </div>
  );
}
