import { apiFetch } from "./client";
import type { MatchResponse, PageResponse } from "./types";

/**
 * One row of `GET /api/v1/activity` — everything relevant to the signed-in
 * player, newest-relevant first. Shipped 2026-09-20, and it is the endpoint
 * `/activity` was waiting for: before it, the page had to assemble a feed from
 * `GET /matches/invitations/me` plus one `GET /matches/{id}` per invitation.
 *
 * `type` and `detail` are a bare string and an untyped object in the spec. Only
 * `MATCH` has been observed, whose detail is the viewer's role plus the **whole
 * match**, participants included — no second request to name it.
 *
 * A row whose `type` we don't know is skipped rather than guessed at, so the
 * backend can add kinds without breaking the page.
 */
export interface ActivityItemResponse {
  type: string;
  /** The match id for a `MATCH` row. */
  referenceId: string;
  /** When this matters — the match's own start, for a `MATCH`. Drives the order. */
  relevantAt: string;
  detail: unknown;
}

/** The `detail` of a `MATCH` row. `role` is a bare string; `ORGANIZER` observed. */
export interface MatchActivityDetail {
  role: string;
  match: MatchResponse;
}

export function isMatchActivity(item: ActivityItemResponse): item is ActivityItemResponse & {
  detail: MatchActivityDetail;
} {
  const detail = item.detail as MatchActivityDetail | null;
  return item.type === "MATCH" && !!detail?.match;
}

export function getActivity(): Promise<PageResponse<ActivityItemResponse>> {
  return apiFetch<PageResponse<ActivityItemResponse>>("/activity?size=50");
}
