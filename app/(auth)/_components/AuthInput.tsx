import { forwardRef, useId } from "react";
import { toPersianDigits } from "@/lib/persian";

interface AuthInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  numeric?: boolean;
  maxLength?: number;
  showLabel?: boolean;
  name?: string;
  disabled?: boolean;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(
  { label, value, onChange, placeholder, numeric, maxLength, showLabel, name, disabled },
  ref
) {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let next = e.target.value;
    if (numeric) {
      next = next.replace(/[^0-9۰-۹]/g, "");
      next = toPersianDigits(next);
    }
    if (maxLength) next = next.slice(0, maxLength);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {showLabel && (
        <label
          htmlFor={id}
          dir="rtl"
          className="text-sm font-normal leading-6 tracking-normal text-white/80 px-1 cursor-pointer"
        >
          {label}
        </label>
      )}
      <div className="relative h-12 w-full">
        <input
          ref={ref}
          id={id}
          name={name}
          type="text"
          inputMode={numeric ? "numeric" : "text"}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          dir="rtl"
          maxLength={maxLength}
          className="w-full h-full rounded-card bg-black/[0.32] border border-input-border px-4 text-white text-sm leading-4 placeholder-white/40 focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_2px_7px_0px_rgba(0,0,0,0.08)]"
          placeholder={placeholder ?? label}
        />
      </div>
    </div>
  );
});

export default AuthInput;
