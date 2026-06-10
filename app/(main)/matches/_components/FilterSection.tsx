import SelectChip from "./SelectChip";

export interface ChipOption {
  id: string;
  label: string;
}

interface Props {
  label: string;
  options: ChipOption[];
  /** Selected option id(s). */
  value: string | string[];
  onChange: (id: string) => void;
}

/** A labeled group of selectable chips, wrapping onto multiple rows. */
export default function FilterSection({ label, options, value, onChange }: Props) {
  const isSelected = (id: string) =>
    Array.isArray(value) ? value.includes(id) : value === id;

  return (
    <div className="flex flex-col gap-3 w-full" dir="rtl" role="group" aria-label={label}>
      <span className="text-base font-semibold text-[#253343]">{label}</span>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <SelectChip
            key={o.id}
            label={o.label}
            selected={isSelected(o.id)}
            onClick={() => onChange(o.id)}
          />
        ))}
      </div>
    </div>
  );
}
