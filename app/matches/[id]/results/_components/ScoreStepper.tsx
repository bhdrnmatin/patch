"use client";

import { toPersianDigits } from "../../../../../lib/persian";

interface Props {
  /** What it counts, for a11y, e.g. "امتیاز تیم ۱ در ست ۲". */
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/** − / value / + control, clamped to min–max (a set's score, a match's capacity). */
export default function ScoreStepper({ label, value, onChange, min = 0, max = 99 }: Props) {
  return (
    <div className="flex items-center gap-1" dir="ltr">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`کم کردن ${label}`}
        className="disabled:opacity-40 size-11 shrink-0 flex items-center justify-center rounded-full bg-surface border border-edge text-ink-soft text-xl font-bold hover:bg-edge active:opacity-80"
      >
        −
      </button>
      <span aria-live="polite" className="w-8 text-center text-xl font-bold text-ink">
        {toPersianDigits(String(value))}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`زیاد کردن ${label}`}
        className="disabled:opacity-40 size-11 shrink-0 flex items-center justify-center rounded-full bg-primary hover:bg-primary-hover text-white text-xl font-bold active:opacity-80"
      >
        +
      </button>
    </div>
  );
}
