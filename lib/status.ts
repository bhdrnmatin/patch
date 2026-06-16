import type { MatchStatus } from "./types";

/** Persian labels for a match/tournament status. Shared by StatusBadge and PosterBadge. */
export const statusLabels: Record<MatchStatus, string> = {
  active: "جاری",
  held: "برگزار شده",
  "not-held": "برگزار نشده",
};
