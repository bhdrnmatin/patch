import { toPersianDigits } from "../../../../lib/persian";

interface Props {
  current: number;
  total: number;
}

const R = 30;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** 64px circular stage indicator (مرحله ۱ از ۳). */
export default function StageDial({ current, total }: Props) {
  const arc = (current / total) * CIRCUMFERENCE;

  return (
    <div className="relative size-16 shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={R} fill="none" className="stroke-edge" strokeWidth="3" />
        <circle
          cx="32"
          cy="32"
          r={R}
          fill="none"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${CIRCUMFERENCE}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="text-[10px] leading-none text-ink" dir="rtl">
          مرحله
        </span>
        <span className="text-sm leading-none text-primary" dir="rtl">
          {toPersianDigits(String(current))} از {toPersianDigits(String(total))}
        </span>
      </div>
    </div>
  );
}
