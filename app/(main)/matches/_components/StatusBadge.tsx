import type { MatchStatus } from "@/lib/types";
import { statusLabels } from "@/lib/status";

const TONES: Record<MatchStatus, string> = {
  active: "bg-primary/10 text-primary",
  held: "bg-success-soft text-success-deep",
  "not-held": "bg-surface text-muted",
};

/** Small status pill shown at the top of a match card. */
export default function StatusBadge({ status }: { status: MatchStatus }) {
  return (
    <span
      dir="rtl"
      className={`inline-flex items-center justify-center px-3 h-7 rounded-pill text-xs ${TONES[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
