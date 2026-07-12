"use client";

import { toPersianDigits } from "../../../../lib/persian";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  numeric?: boolean;
}

/** Light single-line text input: label above, white rounded field. */
export default function TextField({ label, value, onChange, placeholder, numeric }: Props) {
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
        dir="rtl"
        className="w-full h-12 rounded-card bg-white border border-edge px-4 text-sm text-ink-soft placeholder:text-muted focus:outline-none focus:border-primary shadow-card"
      />
    </label>
  );
}
