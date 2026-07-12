"use client";

import { toPersianDigits } from "../../../../../lib/persian";

interface Props {
  /** Context for a11y, e.g. "تیم ۱ در ست ۲". */
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/** − / score / + control for one team's score in a set (clamped 0–99). */
export default function ScoreStepper({ label, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1" dir="ltr">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        aria-label={`کم کردن امتیاز ${label}`}
        className="size-11 shrink-0 flex items-center justify-center rounded-full bg-surface border border-edge text-ink-soft text-xl font-bold hover:bg-edge active:opacity-80"
      >
        −
      </button>
      <span aria-live="polite" className="w-8 text-center text-xl font-bold text-ink">
        {toPersianDigits(String(value))}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        aria-label={`زیاد کردن امتیاز ${label}`}
        className="size-11 shrink-0 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/15 text-primary text-xl font-bold active:opacity-80"
      >
        +
      </button>
    </div>
  );
}
