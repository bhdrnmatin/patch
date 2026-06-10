import { toPersianDigits } from "@/lib/persian";

interface Props {
  day: number;
  weekday: string;
  selected?: boolean;
  /** Dates before today render dimmed (dark glass). */
  past?: boolean;
  onClick?: () => void;
}

/** One day in the Matches date strip. 52×52 glassmorphic cell. */
export default function DateCell({ day, weekday, selected, past, onClick }: Props) {
  const tone = selected
    ? "bg-white text-[#253343]"
    : past
      ? "bg-black/40 text-white"
      : "bg-white/60 text-[#253343]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`size-[52px] shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/15 backdrop-blur-[2px] ${tone}`}
    >
      <span className="text-sm font-bold leading-none">{toPersianDigits(String(day))}</span>
      <span className="text-[10px] leading-none">{weekday}</span>
    </button>
  );
}
