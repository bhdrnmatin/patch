import type { MatchStatus } from "@/lib/types";
import { statusLabels } from "@/lib/status";

/** Dark-glass status pill overlaid on the top-left of a tournament poster. */
export default function PosterBadge({ status }: { status: MatchStatus }) {
  return (
    <span
      dir="rtl"
      className="inline-flex h-7 items-center justify-center rounded-pill bg-black/25 px-3 text-xs font-semibold text-white backdrop-blur-[4px] drop-shadow-[0px_0px_1px_rgba(0,0,0,0.35)]"
    >
      {statusLabels[status]}
    </span>
  );
}
