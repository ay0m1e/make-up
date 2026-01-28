// Presentational time slot button (no selection logic).
type Props = {
  label: string;
  note?: string;
};

export function TimeSlot({ label, note }: Props) {
  return (
    <button
      type="button"
      className="flex w-full flex-col gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-left text-sm text-stone-700 transition hover:border-stone-400"
    >
      <span className="text-base text-stone-900">{label}</span>
      {note ? <span className="text-xs uppercase tracking-[0.25em]">{note}</span> : null}
    </button>
  );
}
