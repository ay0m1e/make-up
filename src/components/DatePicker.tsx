// Presentational date picker list (no selection logic).
type Props = {
  dates: string[];
};

export function DatePicker({ dates }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {dates.map((date) => (
        <button
          key={date}
          type="button"
          className="rounded-2xl border border-stone-200 bg-white px-4 py-4 text-left text-sm text-stone-700 transition hover:border-stone-400"
        >
          {date}
        </button>
      ))}
    </div>
  );
}
