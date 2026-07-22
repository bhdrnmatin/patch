import { forwardRef, useId } from "react";
import { toPersianDigits, toPersianOnly } from "@/lib/persian";

interface AuthInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  numeric?: boolean;
  /** Restrict to Persian text — strips Latin letters/digits as they're typed. */
  persianOnly?: boolean;
  maxLength?: number;
  showLabel?: boolean;
  name?: string;
  disabled?: boolean;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(
  { label, value, onChange, placeholder, numeric, persianOnly, maxLength, showLabel, name, disabled },
  ref
) {
  const id = useId();

  const filter = (raw: string) => {
    let next = raw;
    if (numeric) {
      next = next.replace(/[^0-9۰-۹]/g, "");
      next = toPersianDigits(next);
    } else if (persianOnly) {
      next = toPersianOnly(next);
    }
    if (maxLength) next = next.slice(0, maxLength);
    return next;
  };

  // Apply the filter and keep the DOM in sync. When `next` equals the controlled
  // value React skips the re-render, so on mobile the rejected character would
  // stay in the field — reset it imperatively.
  const apply = (el: HTMLInputElement) => {
    const next = filter(el.value);
    if (el.value !== next) el.value = next;
    onChange(next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => apply(e.currentTarget);
  // Android/Gboard commits predicted words via composition, which re-inserts the
  // characters after onChange strips them — re-filter once composition ends.
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) =>
    apply(e.currentTarget);

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
          onCompositionEnd={handleCompositionEnd}
          disabled={disabled}
          dir="rtl"
          maxLength={maxLength}
          className="w-full h-full rounded-card bg-black/[0.32] border border-input-border px-4 text-white text-sm leading-4 placeholder-white/40 focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-card"
          placeholder={placeholder ?? label}
        />
      </div>
    </div>
  );
});

export default AuthInput;
