"use client";

import { useId } from "react";

export interface SelectOption {
  /** Stored value — sent to the backend (e.g. "MALE"). */
  value: string;
  /** Displayed label (e.g. "آقا"). */
  label: string;
}

interface AuthSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  showLabel?: boolean;
}

/**
 * Dark-glass select matching AuthInput. Uses a native <select> so the OS picker
 * handles opening — reliable on mobile, and long lists scroll natively.
 */
export default function AuthSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  showLabel,
}: AuthSelectProps) {
  const id = useId();

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
        <select
          id={id}
          dir="rtl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-full rounded-card bg-black/[0.32] border border-input-border pr-4 pl-9 text-sm leading-4 appearance-none focus:outline-none focus:border-primary shadow-card ${
            value ? "text-white" : "text-white/40"
          }`}
        >
          <option value="" disabled hidden>
            {placeholder ?? label}
          </option>
          {options.map((o) => (
            // Explicit colors so the open list stays readable on desktop
            // (mobile uses the OS picker and ignores these).
            <option key={o.value} value={o.value} style={{ color: "#00254D", background: "#fff" }}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
