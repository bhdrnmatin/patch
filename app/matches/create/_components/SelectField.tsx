"use client";

import { useId } from "react";
import { ChevronDownIcon } from "../../[id]/_components/icons";

interface Props {
  label: string;
  /** Display label of the current selection; omitted → placeholder state. */
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  /** Locked to a fixed value: shows a lock instead of the chevron, no sheet. */
  disabled?: boolean;
}

/** Light select trigger: label above, white field with chevron; opens a picker sheet. */
export default function SelectField({
  label,
  value,
  placeholder = "انتخاب کنید",
  onClick,
  disabled,
}: Props) {
  const labelId = useId();
  const valueId = useId();

  return (
    <div className="w-full flex flex-col gap-2">
      <span id={labelId} className="text-sm font-bold text-ink-soft text-right" dir="rtl">
        {label}
      </span>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-haspopup={disabled ? undefined : "dialog"}
        aria-labelledby={`${labelId} ${valueId}`}
        className={`w-full h-12 rounded-card bg-white border border-edge px-4 shadow-card flex items-center justify-between gap-2 focus:outline-none focus:border-primary ${
          disabled ? "cursor-default" : "active:opacity-80"
        }`}
      >
        {disabled ? (
          <LockIcon className="size-4 shrink-0 text-muted" />
        ) : (
          <ChevronDownIcon className="size-4 shrink-0 text-muted" />
        )}
        <span
          id={valueId}
          dir="rtl"
          className={`text-sm truncate ${value ? "text-ink-soft" : "text-muted"}`}
        >
          {value ?? placeholder}
        </span>
      </button>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
