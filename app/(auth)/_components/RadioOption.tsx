interface RadioOptionProps {
  label: string;
  selected: boolean;
  divider?: boolean;
  onClick: () => void;
}

export default function RadioOption({ label, selected, divider, onClick }: RadioOptionProps) {
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`w-full min-h-[48px] py-3 px-4 flex items-center gap-3 transition-colors ${
        selected ? "bg-white text-ink rounded-2xl" : "text-white hover:bg-white/5"
      } ${divider ? "border-t border-group-border" : ""}`}
    >
      <span dir="rtl" className="text-xs leading-normal flex-1 text-right">
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          selected
            ? "border-primary bg-primary"
            : "border-input-border bg-transparent"
        }`}
      >
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
    </button>
  );
}
