interface Props {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

/** Selectable pill used in the Sort and Filter sheets. */
export default function SelectChip({ label, selected, onClick }: Props) {
  const tone = selected
    ? // Ink for "this one is on" — the sheet's blue is its apply button.
      "bg-ink text-white"
    : "bg-surface text-ink";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex-1 min-w-[72px] h-12 flex items-center justify-center px-4 rounded-[16px] text-sm font-bold whitespace-nowrap ${tone}`}
    >
      {label}
    </button>
  );
}
