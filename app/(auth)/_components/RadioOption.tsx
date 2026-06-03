interface RadioOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function RadioOption({ label, selected, onClick }: RadioOptionProps) {
  return (
    <button
      onClick={onClick}
      className="w-full min-h-[48px] py-3 px-4 flex items-center gap-3 text-white"
    >
      <span dir="rtl" className="text-[12px] leading-normal flex-1 text-right">
        {label}
      </span>
      <span
        className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          selected
            ? "border-[#33A3FF] bg-[#33A3FF]"
            : "border-[#6783A0] bg-transparent"
        }`}
      >
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
    </button>
  );
}
