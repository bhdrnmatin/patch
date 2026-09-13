import { getClubs } from "@/lib/api/clubs";
import { listMatches } from "@/lib/api/matches";
import type { MatchResponse } from "@/lib/api/types";
import { JALALI_MONTHS, isoToJalali } from "@/lib/jalali";
import { toPersianDigits } from "@/lib/persian";
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

/**
 * Live: the matches list, newest page first.
 *
 * Three of `MatchListItem`'s fields have no source in the API yet — levels,
 * the level average, and price all arrive after the MVP (user, 2026-09-13).
 * They are left undefined rather than defaulted to 0, so the card can drop the
 * element instead of showing «لول ۰» or a free-entry price tag.
 *
 * Locally created matches still come from the mock, since `createMatch` is not
 * wired (see `lib/api/matches.ts`), so both are concatenated until it is.
 */
export async function getMatchList(): Promise<MatchListItem[]> {
  const { content } = await listMatches();
  return [...content.map(toListItem), ...matchList];
}

/** "۱۴ مرداد" from an ISO instant, for the date line on a card. */
function dayMonthLabel(iso: string): string {
  const { jm, jd } = isoToJalali(iso.slice(0, 10));
  return `${toPersianDigits(String(jd))} ${JALALI_MONTHS[jm - 1]}`;
}

/**
 * `status` is an undeclared string in the spec (only OPEN and CANCELLED seen),
 * so only CANCELLED is trusted by name. Everything else is decided from the
 * clock, which can't drift out of sync with an enum nobody documented.
 */
export function toStatus(m: MatchResponse): MatchListItem["status"] {
  if (m.status === "CANCELLED") return "not-held";
  const endsAt = new Date(m.scheduledAt).getTime() + m.durationHours * 3600_000;
  return endsAt < Date.now() ? "held" : "active";
}

/** Exported for `matches.test.ts`. */
export function toListItem(m: MatchResponse): MatchListItem {
  return {
    id: m.id,
    // `title` is nullable in the response even though omitting it on create 500s.
    title: m.title ?? dayMonthLabel(m.scheduledAt),
    status: toStatus(m),
    players: (m.participants ?? []).map((p) => ({
      // Collapse, don't just trim: the API stores firstName with its trailing
      // space ("متین "), so a plain join renders "متین  بهادران" with a visible
      // double gap. Noted in api-findings §1; normalising here costs nothing and
      // does not depend on that ever being fixed.
      name: `${p.firstName ?? ""} ${p.lastName ?? ""}`.replace(/\s+/g, " ").trim(),
      avatar: p.photoUrl ?? undefined,
    })),
    capacity: m.capacity,
    date: dayMonthLabel(m.scheduledAt),
  };
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
