interface Props {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

/** Selectable pill used in the Sort and Filter sheets. */
export default function SelectChip({ label, selected, onClick }: Props) {
  const tone = selected
    ? "bg-primary text-white"
    : "bg-white text-primary shadow-card";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex-1 min-w-[72px] h-12 flex items-center justify-center px-4 rounded-full text-sm font-bold whitespace-nowrap backdrop-blur-[4px] ${tone}`}
    >
      {label}
    </button>
  );
}
