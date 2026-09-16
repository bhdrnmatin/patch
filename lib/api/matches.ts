import { apiFetch } from "./client";
import { jalaliDayMonth } from "../jalali";
import { toPersianDigits } from "../persian";
import type { CreateMatchDraft } from "../types";
import type {
  CreateMatchRequest,
  InviteDirectResponse,
  MatchParticipantResponse,
  MatchResponse,
  PageResponse,
} from "./types";

/**
 * Iran is UTC+03:30 and observes no DST, so shifting an instant by this and then
 * reading its UTC parts gives Tehran wall-clock time.
 */
const TEHRAN_OFFSET_MS = 3.5 * 3600_000;

/**
 * **Workaround, not a model of the world.** `POST /matches` checks "on the hour"
 * against *UTC* minutes, and no Tehran hour has zero UTC minutes, so every slot
 * the wizard offers is rejected (`_designer/api-findings.md` §0, still true
 * 2026-09-16). Until the backend validates in Asia/Tehran, a match is stored
 * this much **earlier** than it really starts — Tehran ۱۸:۰۰ goes up as 14:00Z,
 * not 14:30Z — and every reader adds it back through `matchStartMs`.
 *
 * Earlier rather than later so anything the server times off `scheduledAt`
 * (the must-be-future check, closing joins) errs early, never after the start.
 *
 * ponytail: when the backend fix lands, set this to 0 — but matches created
 * while it was 30 will then read half an hour early; migrate them or recreate.
 */
const API_SHIFT_MS = 30 * 60_000;

/** When the match really starts, in epoch ms — `scheduledAt` with the shift undone. */
export function matchStartMs(scheduledAt: string): number {
  return new Date(scheduledAt).getTime() + API_SHIFT_MS;
}

/**
 * Wizard draft → `POST /matches` body.
 *
 * Pure and exported so `matches.test.ts` can pin the awkward parts without a
 * network. Every oddity below is the API's, recorded in `_designer/api-findings.md`.
 */
export function draftToCreateRequest(draft: CreateMatchDraft): CreateMatchRequest {
  if (!draft.courtId || !draft.date || !draft.time || !draft.duration) {
    throw new Error("createMatch: the draft is missing a court, day, time or duration");
  }

  // The wizard's one "format" question is two API fields. رقابتی is the only
  // one that needs COMPETITIVE, which the backend currently refuses outright.
  const competitive = draft.format === "competitive";

  return {
    format: draft.format === "americano" ? "AMERICANO" : "OPEN_MATCH",
    matchType: competitive ? "COMPETITIVE" : "FRIENDLY",
    clubId: draft.courtId,
    scheduledAt: toInstant(draft.date, draft.time),
    visibility: draft.invite === "private" ? "PRIVATE" : "PUBLIC",
    // The wizard stopped asking (step ۵ was removed 2026-08-20), so it follows
    // visibility: a public match anyone can join, a private one only by link.
    joinPolicy: draft.invite === "private" ? "INVITE_LINK_ONLY" : "OPEN",
    title: draft.title.trim() || fallbackTitle(draft.date),
    capacity: capacityFor(draft),
    durationHours: Math.max(1, Math.round(draft.duration / 60)),
    ...(draft.description.trim() ? { description: draft.description.trim().slice(0, 500) } : {}),
    // برگزار کننده organises without playing; بازیکن takes a slot on court.
    organizerJoins: draft.myRole === "player",
  };
}

/**
 * A backstop, not the normal path: step ۱ requires a title as of 2026-09-12, so
 * this only fires for a draft saved before that. Kept because the failure mode
 * it prevents is a **500** — the API declares `title` optional and then dies
 * without it — and four lines is cheap insurance against that.
 */
function fallbackTitle(isoDate: string): string {
  // jalaliDayMonth already returns Persian digits, which this string needs —
  // it is user-visible the moment the match is created.
  return `مچ ${jalaliDayMonth(isoDate)}`.slice(0, 80);
}

/**
 * `capacity` has a minimum of 4 and the API rejects its absence, but the wizard
 * has no such concept: رقابتی is 2v2, while دوستانه and آمریکانو are deliberately
 * uncapped. The roster it was created with is the only number we can honestly
 * claim, floored at the minimum the API will take.
 */
function capacityFor(draft: CreateMatchDraft): number {
  if (draft.format === "competitive") return 4;
  const onCourt = draft.teammates.length + (draft.myRole === "player" ? 1 : 0);
  return Math.max(4, onCourt);
}

/**
 * "2026-09-20" + "18:00" (Tehran) → "2026-09-20T14:00:00Z" — the real instant,
 * 14:30Z, minus `API_SHIFT_MS` so its UTC minutes are zero. A naive local string
 * is unparseable to the API, which is why this always sends a full instant.
 */
function toInstant(isoDate: string, time: string): string {
  // The picker's last slot is 24:00; an hour overflow rolls into the next day.
  const [h, min] = time.split(":").map(Number);
  const wallAsUtc = Date.UTC(+isoDate.slice(0, 4), +isoDate.slice(5, 7) - 1, +isoDate.slice(8, 10), h, min);
  return new Date(wallAsUtc - TEHRAN_OFFSET_MS - API_SHIFT_MS).toISOString().replace(".000Z", "Z");
}

/** Create a match. Returns the created match, whose `id` the wizard routes to. */
export function createMatch(body: CreateMatchRequest): Promise<MatchResponse> {
  return apiFetch<MatchResponse>("/matches", { method: "POST", body });
}

/**
 * Invite phone numbers into an existing match. The only invite the API has:
 * a number that belongs to a Patch account resolves to it (`inviteeAccountId`),
 * and nobody is on the roster until they accept.
 */
export function inviteByPhone(matchId: string, phoneNumbers: string[]): Promise<InviteDirectResponse[]> {
  return apiFetch<InviteDirectResponse[]>(`/matches/${matchId}/invitations`, {
    method: "POST",
    body: { phoneNumbers },
  });
}

/** The raw keys `failureMessage` has been seen returning, in words a player reads. */
const INVITE_FAILURES: Record<string, string> = {
  "matchmaking.invite.alreadyInvited": "قبلاً به این مچ دعوت شده است.",
  "matchmaking.invite.alreadyParticipant": "از قبل عضو این مچ است.",
};

/**
 * A `failureMessage` fit to show. The Persian ones pass through (with their
 * Latin digits converted); a raw key is translated, or replaced with a generic
 * line rather than put on screen as `matchmaking.…`.
 */
export function inviteFailureText(message: string | null): string {
  if (!message) return "دعوت ارسال نشد.";
  if (/^[\w.]+$/.test(message)) return INVITE_FAILURES[message] ?? "دعوت ارسال نشد.";
  return toPersianDigits(message);
}

/** One match, by id. Same shape as create returns, with `participants` filled. */
export function getMatch(id: string): Promise<MatchResponse> {
  return apiFetch<MatchResponse>(`/matches/${id}`);
}

/**
 * The matches list. One oversized page: the list screen has no pagination UI
 * and filters client-side, so asking for more than exists is simpler than
 * pretending to page.
 * ponytail: real paging when the list is long enough to need it.
 */
export function listMatches(): Promise<PageResponse<MatchResponse>> {
  return apiFetch<PageResponse<MatchResponse>>("/matches?size=100");
}

/** Ask to join. On an OPEN match this confirms immediately; on MANUAL_APPROVE
 *  it creates a REQUESTED row for the organizer to decide on. */
export function joinMatch(matchId: string): Promise<MatchParticipantResponse> {
  return apiFetch<MatchParticipantResponse>(`/matches/${matchId}/join`, { method: "POST" });
}

/** Leave, or withdraw a pending request — the same endpoint does both. */
export function leaveMatch(matchId: string): Promise<MatchParticipantResponse> {
  return apiFetch<MatchParticipantResponse>(`/matches/${matchId}/participants/me`, {
    method: "DELETE",
  });
}

/** Cancel a match (organizer). A soft delete: the match stays and becomes CANCELLED. */
export function cancelMatch(matchId: string): Promise<MatchResponse> {
  return apiFetch<MatchResponse>(`/matches/${matchId}`, { method: "DELETE" });
}

/**
 * Approve or reject a pending join request.
 *
 * `participantId` is `MatchParticipantResponse.id`, not an account id. Only the
 * organizer may call these; the server enforces it.
 */
export function decideParticipant(
  matchId: string,
  participantId: string,
  accept: boolean,
): Promise<MatchParticipantResponse> {
  return apiFetch<MatchParticipantResponse>(
    `/matches/${matchId}/participants/${participantId}/${accept ? "approve" : "reject"}`,
    { method: "POST" },
  );
}

/** The API's format enum as the app writes it. آمریکانو/دوستانه are the two the
 *  wizard can produce; MEXICANO exists in the API but has no UI yet. */
export const FORMAT_LABELS: Record<MatchResponse["format"], string> = {
  OPEN_MATCH: "دوستانه",
  AMERICANO: "آمریکانو",
  MEXICANO: "مکزیکانو",
};

/**
 * The Tehran calendar date of an instant, ISO "YYYY-MM-DD" — what the date
 * strip compares against. Same +3:30 shift as `tehranTimeRange`: a match at
 * 21:00 Tehran is 17:30Z, and reading the UTC date would be right, but one at
 * 02:00 Tehran is 22:30Z the day before, and would land on the wrong cell.
 */
export function tehranDateISO(scheduledAt: string): string {
  const d = new Date(matchStartMs(scheduledAt) + TEHRAN_OFFSET_MS);
  return d.toISOString().slice(0, 10);
}

/**
 * "۱۴:۰۰ الی ۱۵:۰۰" — the match's window in Tehran local time. Arithmetic rather
 * than an Intl timezone lookup because the offset is fixed.
 */
export function tehranTimeRange(scheduledAt: string, durationHours: number): string {
  const start = matchStartMs(scheduledAt) + TEHRAN_OFFSET_MS;
  const end = start + durationHours * 3600_000;
  const hhmm = (ms: number) => {
    const d = new Date(ms);
    return toPersianDigits(
      `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`,
    );
  };
  return `${hhmm(start)} الی ${hhmm(end)}`;
}
