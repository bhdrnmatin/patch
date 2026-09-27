import type { MatchStatus } from "@/lib/types";
import { statusLabels } from "@/lib/status";

const TONES: Record<MatchStatus, string> = {
  // Ink, not blue: the card already has a blue court and a blue button.
  active: "bg-ink text-white",
  held: "bg-success-soft text-success-deep",
  "not-held": "bg-surface text-muted",
};

/** Small status pill shown at the top of a match card. */
export default function StatusBadge({ status }: { status: MatchStatus }) {
  return (
    <span
      dir="rtl"
      className={`inline-flex items-center justify-center gap-1.5 px-3 h-7 rounded-pill text-xs font-bold ${TONES[status]}`}
    >
      {statusLabels[status]}
      {/* A live match gets the ball-lime dot, the same accent as the selected
          hero date. dir="rtl" puts it after the label, on the left. */}
      {status === "active" && (
        <span aria-hidden className="relative flex size-1.5">
          <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
          <span className="relative size-1.5 rounded-full bg-accent" />
        </span>
      )}
    </span>
  );
}
