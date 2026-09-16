import { toPersianDigits } from "@/lib/persian";

interface Props {
  day: number;
  weekday: string;
  selected?: boolean;
  /** Dates before today render faded — still tappable, since a past day can hold matches. */
  past?: boolean;
  /** glass = over hero imagery (default) · light = on bg-surface pages. */
  tone?: "glass" | "light";
  onClick?: () => void;
}

/** One day in the Matches date strip. 52×52 glassmorphic cell. */
export default function DateCell({ day, weekday, selected, past, tone = "glass", onClick }: Props) {
  const skin =
    tone === "glass"
      ? // Over the bright court photo. Selected is dark navy: the brand blue
        // matched the turf behind it and vanished. Past keeps an opaque cell and
        // greys only its text — opacity on the whole cell let the photo through
        // the digits.
        `backdrop-blur-[2px] ${
          selected
            ? "border-accent bg-ink text-white"
            : past
              ? "border-white/15 bg-white/85 text-muted"
              : "border-white/15 bg-white/85 text-ink-soft"
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
      className={`size-[52px] shrink-0 flex flex-col items-center justify-center gap-1 rounded-field border ${skin}`}
    >
      <span className="text-sm font-bold leading-none">{toPersianDigits(String(day))}</span>
      <span className="text-tiny leading-none">{weekday}</span>
      {/* The ball's lime marks the pick, with the border (user, 2026-09-16). */}
      {selected && tone === "glass" && <span aria-hidden className="size-1 rounded-full bg-accent" />}
    </button>
  );
}
