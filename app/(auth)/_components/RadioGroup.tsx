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
      className="w-full bg-black/[0.32] border border-[#57728E] rounded-[24px] overflow-clip flex flex-col divide-y divide-[#57728E]"
    >
      {options.map((option) => (
        <RadioOption
          key={option}
          label={option}
          selected={value === option}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  );
}
