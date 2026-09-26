import { apiFetch } from "./client";
import { toPersianDigits } from "../persian";
import type { CreateMatchDraft } from "../types";
import type {
  CreateMatchRequest,
  InviteDirectResponse,
  InviteSuggestionResponse,
  MatchInvitationInviteeResponse,
  MatchInvitationResponse,
  MatchParticipantResponse,
  MatchResponse,
  MatchResultResponse,
  SubmitMatchResultRequest,
  PageResponse,
} from "./types";

/**
 * Iran is UTC+03:30 and observes no DST, so shifting an instant by this and then
 * reading its UTC parts gives Tehran wall-clock time.
 */
const TEHRAN_OFFSET_MS = 3.5 * 3600_000;

/**
 * When the match starts, in epoch ms.
 *
 * Times go over the wire in **Tehran time** (`2026-09-28T18:00:00+03:30`) and
 * the backend answers in it too (user, 2026-09-24). Until then the backend
 * floored every start to a whole *UTC* hour, so the app stored matches 30
 * minutes early and added it back here (`API_SHIFT_MS`, removed). A string
 * with no offset at all is read as Tehran, not as the device's zone.
 */
export function matchStartMs(scheduledAt: string): number {
  const zoned = /(Z|[+-]\d\d:?\d\d)$/.test(scheduledAt) ? scheduledAt : `${scheduledAt}+03:30`;
  return new Date(zoned).getTime();
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
    title: draft.title.trim() || autoTitle(draft),
    capacity: capacityFor(draft),
    durationHours: Math.max(1, Math.round(draft.duration / 60)),
    ...(draft.description.trim() ? { description: draft.description.trim().slice(0, 500) } : {}),
    // برگزار کننده organises without playing; بازیکن takes a slot on court.
    organizerJoins: draft.myRole === "player",
  };
}

/**
 * The title a match gets when step ۱'s is left empty (optional since
 * 2026-09-17): «باشگاه انقلاب، ساعت ۱۸:۰۰». The wizard passes the club name,
 * which the draft only holds as an id; without it this still beats sending no
 * title, which the API declares optional and then answers with a **500**.
 */
export function autoTitle(draft: CreateMatchDraft, club?: string): string {
  const time = toPersianDigits(draft.time ?? "");
  return `${club ?? "مچ"}، ساعت ${time}`.slice(0, 80);
}

/**
 * `capacity` is required and bounded per format: OPEN_MATCH (رقابتی, دوستانه)
 * is exactly 4, AMERICANO 4–12 (enforced since 2026-09-26). An americano takes
 * the roster it was created with, floored at 4; `maxTeammates` keeps it ≤ 12.
 */
function capacityFor(draft: CreateMatchDraft): number {
  if (draft.format !== "americano") return 4;
  const onCourt = draft.teammates.length + (draft.myRole === "player" ? 1 : 0);
  return Math.max(4, onCourt);
}

/**
 * "2026-09-20" + "18:00" → "2026-09-20T18:00:00+03:30": the wall-clock time the
 * player picked, in Tehran time. Always with the offset — a naive string was
 * unparseable to the API.
 */
function toInstant(isoDate: string, time: string): string {
  // The picker's last slot is 24:00; an hour overflow rolls into the next day.
  const [h, min] = time.split(":").map(Number);
  const wall = new Date(Date.UTC(+isoDate.slice(0, 4), +isoDate.slice(5, 7) - 1, +isoDate.slice(8, 10), h, min));
  return `${wall.toISOString().slice(0, 16)}:00+03:30`;
}

/**
 * The earliest bookable slot is a full hour away: at 8:10 that's **10:00**, at
 * 8:00 it's 9:00 (user, 2026-09-24). Slots are on the hour, so "starts at least
 * an hour from now" is the whole rule. It also keeps clear of the API's lock,
 * which refuses every write to a match from an hour before it starts
 * («زمان قفل این مچ فرارسیده…», probed 2026-09-19).
 *
 * The wizard greys out anything this rejects.
 */
const LEAD_MS = 60 * 60_000;

export function isSchedulable(isoDate: string, time: string, now = Date.now()): boolean {
  return matchStartMs(toInstant(isoDate, time)) >= now + LEAD_MS;
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

/**
 * Who this player can be invited from the picker: the people the API suggests,
 * each with the phone number an invite is addressed to. A bare array, not a page.
 */
export function getInviteSuggestions(): Promise<InviteSuggestionResponse[]> {
  return apiFetch<InviteSuggestionResponse[]>("/matches/invitations/suggestions");
}

/** The invitations sent *to* the signed-in player. One page, like the matches list. */
export function getMyInvitations(): Promise<PageResponse<MatchInvitationResponse>> {
  return apiFetch<PageResponse<MatchInvitationResponse>>("/matches/invitations/me?size=100");
}

/** Accept an invitation — the invitee joins, so this answers with their participant row. */
export function acceptInvitation(invitationId: string): Promise<MatchParticipantResponse> {
  return apiFetch<MatchParticipantResponse>(`/matches/invitations/${invitationId}/accept`, {
    method: "POST",
  });
}

/**
 * Decline an invitation. New on the backend 2026-09-24 — until then the invitee
 * had no way to say no (`DELETE …/{id}` is the organizer's, and 403s for them).
 * Answers with the invitation; its declined `status` value is not yet seen.
 */
export function declineInvitation(invitationId: string): Promise<MatchInvitationResponse> {
  return apiFetch<MatchInvitationResponse>(`/matches/invitations/${invitationId}/decline`, {
    method: "POST",
  });
}

/** The invitations a match's organizer has sent, any status. New 2026-09-26. */
export function getMatchInvitations(matchId: string): Promise<MatchInvitationInviteeResponse[]> {
  return apiFetch<MatchInvitationInviteeResponse[]>(`/matches/${matchId}/invitations`);
}

/** The organizer withdraws an invitation; it comes back `CANCELLED`. */
export function cancelInvitation(invitationId: string): Promise<MatchInvitationResponse> {
  return apiFetch<MatchInvitationResponse>(`/matches/invitations/${invitationId}`, {
    method: "DELETE",
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

/**
 * The match behind a share link. Same shape as `GET /matches/{id}`, but
 * **`participants` comes back empty** — the token names a match to someone who
 * is not in it yet, so it says nothing about who is.
 *
 * Not public: both this and the join below answer 401 without a session
 * (probed 2026-09-20), which is why `/join/[token]` is a guarded route and the
 * login it bounces through carries a `next` back to it.
 */
export function getMatchByInviteToken(token: string): Promise<MatchResponse> {
  return apiFetch<MatchResponse>(`/matches/invite/${token}`);
}

/**
 * Join through a share link. Auto-confirms **regardless of the match's
 * visibility or join policy** (the backend's own words), so the link is the
 * one way past MANUAL_APPROVE — treat it as the capability it is.
 *
 * 409 «شما قبلاً در این مچ عضو شده‌اید» when the viewer is already in.
 */
export function joinByInviteToken(token: string): Promise<MatchParticipantResponse> {
  return apiFetch<MatchParticipantResponse>(`/matches/invite/${token}/join`, { method: "POST" });
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
 * Remove a confirmed player from the roster (organizer only, enforced server
 * side). `participantId` is `MatchParticipantResponse.id`, the same id space
 * approve/reject uses — not an account id.
 *
 * The organizer cannot remove themselves: probed 2026-09-22, that answers 403
 * «برگزارکننده نمی‌تواند خودش را از مچ حذف کند؛ به‌جای آن مچ را لغو کنید».
 */
export function removeParticipant(
  matchId: string,
  participantId: string,
): Promise<MatchParticipantResponse> {
  return apiFetch<MatchParticipantResponse>(`/matches/${matchId}/participants/${participantId}`, {
    method: "DELETE",
  });
}

/**
 * Replace the match's invite token, which **revokes the old link**: probed
 * 2026-09-22, `GET /matches/invite/{old}` 404s the moment this returns. The
 * response is the whole match, carrying the new `inviteToken`.
 *
 * Organizer only; the server enforces it. There is no undo — the old token is
 * gone, so anyone holding that link needs the new one.
 */
export function regenerateInviteToken(matchId: string): Promise<MatchResponse> {
  return apiFetch<MatchResponse>(`/matches/${matchId}/invite-token/regenerate`, {
    method: "POST",
  });
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

/**
 * Submit the match's result. Probed 2026-09-24 on error paths only — the happy
 * path needs a match that was actually played:
 * a cancelled match answers 409 `matchmaking.result.matchCancelled`, a negative
 * score 400 naming the set.
 */
export function submitMatchResult(
  matchId: string,
  body: SubmitMatchResultRequest,
): Promise<MatchResultResponse> {
  return apiFetch<MatchResultResponse>(`/matches/${matchId}/result`, { method: "POST", body });
}

const RESULT_FAILURES: Record<string, string> = {
  "matchmaking.result.matchCancelled": "این مَچ لغو شده است.",
  "matchmaking.result.invalidTeamComposition": "هر تیم باید دو بازیکن تاییدشده‌ی همین مَچ باشد.",
};

/** The result endpoints answer in raw keys; never put `matchmaking.…` on screen. */
export function resultFailureText(message: string): string {
  if (/^[\w.]+$/.test(message)) return RESULT_FAILURES[message] ?? "ثبت نتیجه انجام نشد. دوباره تلاش کن.";
  return toPersianDigits(message);
}
