import { getClubs } from "@/lib/api/clubs";
import { FORMAT_LABELS, getMatch, listMatches, tehranTimeRange } from "@/lib/api/matches";
import type { MatchResponse } from "@/lib/api/types";
import { jalaliDayMonth } from "@/lib/jalali";
import { matchDays, matchList, pickablePlayers } from "@/lib/mock";
import type {
  MatchDetailsStatus,
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
    title: m.title ?? jalaliDayMonth(m.scheduledAt),
    status: toStatus(m),
    players: (m.participants ?? []).map((p) => ({
      // Collapse, don't just trim: the API stores firstName with its trailing
      // space ("متین "), so a plain join renders "متین  بهادران" with a visible
      // double gap. Noted in api-findings §1; normalising here costs nothing and
      // does not depend on that ever being fixed.
      name: fullName(p.firstName, p.lastName),
      avatar: p.photoUrl ?? undefined,
    })),
    capacity: m.capacity,
    date: jalaliDayMonth(m.scheduledAt),
  };
}

/**
 * Live: one match by id.
 *
 * Six of `MatchDetails`' fields have no API source and stay undefined, so their
 * card drops itself rather than rendering a blank row — `fee`, `deadline`,
 * `restriction`, `courtNote`, `teamNote` and the FAQ. Levels are absent too, so
 * `players` carry names and photos only.
 *
 * The club is resolved against the clubs list rather than fetched per match:
 * `MatchResponse` carries only `clubId`, and the app already loads all five
 * clubs for the wizard's court picker. One cached query gives the name and the
 * coordinates `CourtMap` needs, with no extra round trip.
 */
export async function getMatchDetails(id: string): Promise<MatchDetails> {
  const [m, clubs] = await Promise.all([getMatch(id), getClubs()]);
  const club = clubs.content.find((c) => c.id === m.clubId);

  // "CONFIRMED" is the only participant status observed on the live API
  // (2026-09-14) and the spec declares the field as a bare string, so it is the
  // only one counted. See the note on `requests` below.
  const confirmed = (m.participants ?? []).filter((p) => p.status === "CONFIRMED");

  return {
    id: m.id,
    title: m.title ?? jalaliDayMonth(m.scheduledAt),
    organizerAccountId: m.organizer.accountId,
    stage: toDetailsStatus(m),
    format: FORMAT_LABELS[m.format] ?? m.format,
    club: club?.name ?? "—",
    capacity: m.capacity,
    filled: confirmed.length,
    creator: fullName(m.organizer.firstName, m.organizer.lastName),
    date: jalaliDayMonth(m.scheduledAt),
    timeRange: tehranTimeRange(m.scheduledAt, m.durationHours),
    description: m.description ?? "",
    players: confirmed.map((p) => ({
      name: fullName(p.firstName, p.lastName),
      avatar: p.photoUrl ?? undefined,
    })),
    courtLat: club?.latitude,
    courtLng: club?.longitude,
    faq: [],
    // Empty on purpose, not unfinished. Approving someone needs the *pending*
    // participant status, and only "CONFIRMED" has ever been seen — producing a
    // pending row needs a second account joining a MANUAL_APPROVE match, which
    // this project cannot do yet. Guessing at "PENDING" is exactly the mistake
    // the match-status mapping avoids. Ask the backend to declare the enum.
    requests: [],
  };
}

/**
 * Which of the three detail frames a match is in, worked out from the clock.
 *
 * The page used to read this from a `?status=` query param — a device for
 * building the Figma frames that had shipped. Same reasoning as the list's
 * `toStatus`: the match-level `status` enum is undeclared, so only CANCELLED is
 * trusted by name and the rest is arithmetic on `scheduledAt + durationHours`.
 *
 * A cancelled match maps to `finished` because there is nothing left to do with
 * it, and the CTA matrix has no cancelled column. Worth revisiting if the design
 * grows one.
 */
export function toDetailsStatus(m: MatchResponse): MatchDetailsStatus {
  if (m.status === "CANCELLED") return "finished";
  const start = new Date(m.scheduledAt).getTime();
  const end = start + m.durationHours * 3600_000;
  const now = Date.now();
  if (now < start) return "upcoming";
  return now < end ? "live" : "finished";
}

/** The API stores firstName with a trailing space, so collapse rather than trim. */
function fullName(first?: string | null, last?: string | null): string {
  return `${first ?? ""} ${last ?? ""}`.replace(/\s+/g, " ").trim();
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
