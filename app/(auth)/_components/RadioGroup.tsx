import RadioOption from "./RadioOption";

interface RadioGroupProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

export default function RadioGroup({ options, value, onChange, label }: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="w-full bg-black/[0.32] border border-group-border rounded-group overflow-clip p-1.5 flex flex-col"
    >
      {options.map((option, i) => (
        <RadioOption
          key={option}
          label={option}
          selected={value === option}
          divider={i > 0 && value !== option && value !== options[i - 1]}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  );
}
