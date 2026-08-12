"use client";

import { useId } from "react";
import { toPersianDigits } from "../../../../lib/persian";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  numeric?: boolean;
  /** Validation message. Rendered under the field and announced — a message the
   *  field isn't wired to is invisible to a screen reader. */
  error?: string;
}

/** Light single-line text input: label above, white rounded field. */
export default function TextField({ label, value, onChange, placeholder, numeric, error }: Props) {
  const errorId = useId();
  const handleChange = (raw: string) => {
    if (numeric) {
      onChange(toPersianDigits(raw.replace(/[^0-9۰-۹]/g, "")));
    } else {
      onChange(raw);
    }
  };

  return (
    <label className="w-full flex flex-col gap-2">
      <span className="text-sm font-bold text-ink-soft text-right" dir="rtl">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        inputMode={numeric ? "numeric" : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        dir="rtl"
        className={`w-full h-12 rounded-card bg-white border px-4 text-sm text-ink-soft placeholder:text-muted focus:outline-none focus:border-primary shadow-card ${
          error ? "border-danger" : "border-edge"
        }`}
      />
      {error && (
        <span id={errorId} role="alert" className="text-xs text-danger text-right leading-5" dir="rtl">
          {error}
        </span>
      )}
    </label>
  );
}
