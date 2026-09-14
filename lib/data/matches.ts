import { getClubs } from "@/lib/api/clubs";
import { getAccountId } from "@/lib/api/session";
import { FORMAT_LABELS, getMatch, listMatches, tehranTimeRange } from "@/lib/api/matches";
import type { MatchParticipantResponse, MatchResponse } from "@/lib/api/types";
import { jalaliDayMonth } from "@/lib/jalali";
import { matchDays, matchList, pickablePlayers } from "@/lib/mock";
import type {
  ViewerParticipation,
  ViewerRole,
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
  const participants = m.participants ?? [];
  const confirmed = participants.filter((p) => p.status === "CONFIRMED");
  // "REQUESTED" + joinChannel "REQUEST" is what POST /matches/{id}/join produces
  // on a MANUAL_APPROVE match — observed 2026-09-14 with a second account, since
  // the enum is still undeclared in the spec.
  const requested = participants.filter((p) => p.status === "REQUESTED");

  const mine = viewerParticipation(participants, getAccountId());

  return {
    id: m.id,
    title: m.title ?? jalaliDayMonth(m.scheduledAt),
    organizerAccountId: m.organizer.accountId,
    stage: toDetailsStatus(m),
    viewerParticipation: mine.state,
    viewerParticipantId: mine.participantId,
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
    // `id` is the participant id, which is what approve/reject is addressed to.
    // `level` and `side` have no source — the row omits them.
    requests: requested.map((p) => ({
      id: p.id,
      name: fullName(p.firstName, p.lastName),
      avatar: p.photoUrl ?? undefined,
    })),
  };
}

/**
 * Creator or player, from the two account ids.
 *
 * Exported and tested because "creator" used to be the *default* — the page read
 * `?role=` and fell back to creator — so seeing a creator view proves nothing on
 * its own. Both branches are pinned in `matches.test.ts`.
 *
 * A null viewer (signed out, or an undecodable token) is a player: the safe side
 * of a decision that gates لغو مَچ and ویرایش.
 */
/**
 * Where the viewer stands in a match, from the participant rows.
 *
 * Pure and exported because the CTA hangs off it: someone who has never asked to
 * join was being offered «لغو ارسال درخواست ورود» — cancel a request they never
 * made — because the button was chosen by role and stage alone.
 *
 * Anything that is neither CONFIRMED nor REQUESTED counts as not involved. A
 * rejected participant has not been observed (api-findings §0d), so this is the
 * conservative reading: it offers to join rather than to leave.
 */
export function viewerParticipation(
  participants: MatchParticipantResponse[],
  viewerAccountId: string | null,
): { state: ViewerParticipation; participantId?: string } {
  if (!viewerAccountId) return { state: "none" };
  const mine = participants.find((p) => p.accountId === viewerAccountId);
  if (!mine) return { state: "none" };
  if (mine.status === "CONFIRMED") return { state: "confirmed", participantId: mine.id };
  if (mine.status === "REQUESTED") return { state: "requested", participantId: mine.id };
  return { state: "none" };
}

export function viewerRole(organizerAccountId: string, viewerAccountId: string | null): ViewerRole {
  return viewerAccountId !== null && viewerAccountId === organizerAccountId ? "creator" : "player";
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
