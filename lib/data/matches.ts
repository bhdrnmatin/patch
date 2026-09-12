import { getClubs } from "@/lib/api/clubs";
import {
  matchDays,
  matchList,
  matchDetails,
  pickablePlayers,
} from "@/lib/mock";
import type {
  DayOption,
  MatchListItem,
  MatchDetails,
  CourtOption,
  MatchPlayer,
} from "@/lib/types";

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

/** Create-match wizard lookups */

export async function getCourtOptions(): Promise<CourtOption[]> {
  // Live: the wizard needs a real club id — POST /matches requires one and
  // rejects anything it doesn't know, so this is the only source that lets a
  // created match reach the API. ACTIVE-only, since the picker shouldn't offer
  // a club that can't take a booking.
  const { content } = await getClubs();
  return content
    .filter((c) => c.status === "ACTIVE")
    .map((c) => ({ id: c.id, club: c.name, location: c.address, lat: c.latitude, lng: c.longitude }));
}

export async function getPickablePlayers(): Promise<MatchPlayer[]> {
  // Still the mock. The wizard's "از بین بازیکنان پچ" list is meant to be the
  // people you have actually played with (user decision 2026-09-12) — not a
  // directory of every Patch account, which is both useless to scroll and a way
  // to enumerate other users. The copy in AddPlayerSheet already says that.
  // Needs an endpoint that returns the current player's previous teammates;
  // there is no player lookup of any kind on the API yet. See TODO.md.
  return pickablePlayers;
}
