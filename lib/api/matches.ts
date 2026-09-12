import { apiFetch } from "./client";
import { JALALI_MONTHS, isoToJalali } from "../jalali";
import { toPersianDigits } from "../persian";
import type { CreateMatchDraft } from "../types";
import type { CreateMatchRequest, MatchResponse } from "./types";

/** Tehran is UTC+03:30 — a fixed offset; Iran no longer observes DST. */
const TEHRAN_OFFSET = "+03:30";

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
  const { jm, jd } = isoToJalali(isoDate);
  // Persian digits: this string is user-visible the moment the match is
  // created, and Latin digits are wrong everywhere in this app.
  return `مچ ${toPersianDigits(String(jd))} ${JALALI_MONTHS[jm - 1]}`.slice(0, 80);
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
 * "2026-09-20" + "18:00" → "2026-09-20T18:00:00+03:30".
 *
 * The offset is not optional: a naive local string comes back as
 * `validation.invalidFormat … java.time.Instant`.
 *
 * **This is currently rejected for every slot the wizard offers.** The API
 * requires zero *UTC* minutes, and Tehran is +03:30, so every local hour lands
 * on :30 UTC. Sending the local hour is still right — the fix belongs on the
 * server, which should validate the hour in the club's own timezone — so this
 * deliberately does not shift the time to make the check pass.
 */
function toInstant(isoDate: string, time: string): string {
  // The picker's last slot is 24:00, which is midnight on the following day.
  if (time === "24:00") {
    const next = new Date(`${isoDate}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    return `${next.toISOString().slice(0, 10)}T00:00:00${TEHRAN_OFFSET}`;
  }
  return `${isoDate}T${time}:00${TEHRAN_OFFSET}`;
}

/** Create a match. Returns the created match, whose `id` the wizard routes to. */
export function createMatch(body: CreateMatchRequest): Promise<MatchResponse> {
  return apiFetch<MatchResponse>("/matches", { method: "POST", body });
}
