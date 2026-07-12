import { toPersianDigits } from "@/lib/persian";

interface Props {
  day: number;
  weekday: string;
  selected?: boolean;
  /** Dates before today render dimmed (dark glass). */
  past?: boolean;
  /** glass = over hero imagery (default) · light = on bg-surface pages. */
  tone?: "glass" | "light";
  onClick?: () => void;
}

/** One day in the Matches date strip. 52×52 glassmorphic cell. */
export default function DateCell({ day, weekday, selected, past, tone = "glass", onClick }: Props) {
  const skin =
    tone === "glass"
      ? `border-white/15 backdrop-blur-[2px] ${
          selected ? "bg-white text-ink-soft" : past ? "bg-black/40 text-white" : "bg-white/60 text-ink-soft"
        }`
      : selected
        ? "border-primary bg-primary text-white"
        : past
          ? "border-edge bg-surface text-muted"
          : "border-edge bg-white text-ink-soft";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`size-[52px] shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl border ${skin}`}
    >
      <span className="text-sm font-bold leading-none">{toPersianDigits(String(day))}</span>
      <span className="text-tiny leading-none">{weekday}</span>
    </button>
  );
}
