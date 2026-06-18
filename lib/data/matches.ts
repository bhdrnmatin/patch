import { matchDays, matchList, matchDetails } from "@/lib/mock";
import type { DayOption, MatchListItem, MatchDetails } from "@/lib/types";

// Data accessors — the seam between the UI and the (not-yet-built) API.
// Today they resolve mock data; when the API is ready, swap each body for a
// `fetch` that maps the response into the same view-model type. Callers (and
// their React Query keys) don't change.

export async function getMatchDays(): Promise<DayOption[]> {
  return matchDays;
}

export async function getMatchList(): Promise<MatchListItem[]> {
  return matchList;
}

export async function getMatchDetails(id: string): Promise<MatchDetails> {
  // One mock record for now; the real endpoint will key off `id`.
  void id;
  // Clone so mutations to the in-memory mock surface as a new reference on
  // refetch (React Query's structural sharing skips same-reference results).
  return structuredClone(matchDetails);
}
