/**
 * Pins the awkward parts of the wizard-draft → POST /matches mapping.
 *
 * Every case here exists because the API disagrees with the wizard somewhere;
 * the reasons are in `_designer/api-findings.md` and in `matches.ts`.
 *
 * Run: npx tsx lib/api/matches.test.ts
 */
import assert from "node:assert/strict";
import { autoTitle, draftToCreateRequest, inviteFailureText, isSchedulable, tehranDateISO, tehranTimeRange, FORMAT_LABELS } from "./matches";
import type { CreateMatchDraft } from "../types";

const base: CreateMatchDraft = {
  format: "friendly",
  title: "",
  description: "",
  invite: "public",
  reserved: true,
  courtId: "68afb849-cb87-41e9-8aff-11fa720d0f72",
  date: "2026-09-20",
  time: "18:00",
  duration: 60,
  myRole: "player",
  teammates: [],
  coach: null,
};
const d = (p: Partial<CreateMatchDraft> = {}): CreateMatchDraft => ({ ...base, ...p });

// The wizard's single format question is two API fields.
assert.equal(draftToCreateRequest(d({ format: "americano" })).format, "AMERICANO");
assert.equal(draftToCreateRequest(d({ format: "friendly" })).format, "OPEN_MATCH");
assert.equal(draftToCreateRequest(d({ format: "competitive" })).format, "OPEN_MATCH");
assert.equal(draftToCreateRequest(d({ format: "americano" })).matchType, "FRIENDLY");
assert.equal(draftToCreateRequest(d({ format: "competitive" })).matchType, "COMPETITIVE");

// An empty title is generated — never sent empty, which the API answers with a 500.
assert.equal(draftToCreateRequest(d()).title, "مچ، ساعت ۱۸:۰۰");
assert.equal(autoTitle(d(), "باشگاه انقلاب"), "باشگاه انقلاب، ساعت ۱۸:۰۰");
assert.equal(draftToCreateRequest(d({ title: "  شب پدل  " })).title, "شب پدل");

// capacity: minimum 4, and رقابتی is always 2v2.
assert.equal(draftToCreateRequest(d({ format: "competitive" })).capacity, 4);
assert.equal(draftToCreateRequest(d({ teammates: [] })).capacity, 4, "floored at the API minimum");
assert.equal(
  draftToCreateRequest(d({
    teammates: [
      { kind: "player", index: 0 },
      { kind: "player", index: 1 },
      { kind: "invite", phone: "09120000000" },
      { kind: "invite", phone: "09120000001" },
    ],
  })).capacity,
  5,
  "four teammates plus the creator on court",
);

// The organizer only takes a slot when they are playing.
assert.equal(draftToCreateRequest(d({ myRole: "player" })).organizerJoins, true);
assert.equal(draftToCreateRequest(d({ myRole: "captain" })).organizerJoins, false);

// Minutes are hours, floored at the API's minimum of 1.
assert.equal(draftToCreateRequest(d({ duration: 60 })).durationHours, 1);
assert.equal(draftToCreateRequest(d({ duration: 120 })).durationHours, 2);

// scheduledAt is Tehran ۱۸:۰۰ (14:30Z) sent 30 minutes early, so its UTC minutes
// are zero — the API rejects anything else (API_SHIFT_MS).
assert.equal(draftToCreateRequest(d()).scheduledAt, "2026-09-20T14:00:00Z");
// The picker's last slot is midnight, which belongs to the next day.
assert.equal(draftToCreateRequest(d({ time: "24:00" })).scheduledAt, "2026-09-20T20:00:00Z");
// Early-morning slots cross back into the previous UTC day.
assert.equal(draftToCreateRequest(d({ time: "02:00" })).scheduledAt, "2026-09-19T22:00:00Z");
// Round trip: what the wizard sends reads back as what the player picked.
assert.equal(tehranTimeRange(draftToCreateRequest(d()).scheduledAt, 1), "۱۸:۰۰ الی ۱۹:۰۰");
assert.equal(tehranDateISO(draftToCreateRequest(d({ time: "24:00" })).scheduledAt), "2026-09-21");

// visibility drives joinPolicy now that step ۵ is gone.
assert.equal(draftToCreateRequest(d({ invite: "public" })).joinPolicy, "OPEN");
assert.equal(draftToCreateRequest(d({ invite: "private" })).joinPolicy, "INVITE_LINK_ONLY");
assert.equal(draftToCreateRequest(d({ invite: "private" })).visibility, "PRIVATE");

// description is omitted entirely rather than sent empty.
assert.equal("description" in draftToCreateRequest(d()), false);
assert.equal(draftToCreateRequest(d({ description: " بیا " })).description, "بیا");

// An incomplete draft is a bug, not a request to send half a match.
assert.throws(() => draftToCreateRequest(d({ courtId: null })), /missing a court/);
assert.throws(() => draftToCreateRequest(d({ time: null })), /missing a court/);

// tehranTimeRange: stored instant + 30min shift + 3:30 offset = +4:00 on the wire.
assert.equal(tehranTimeRange("2026-09-27T14:00:00Z", 2), "۱۸:۰۰ الی ۲۰:۰۰");
// Crossing midnight must not wrap to a negative or a 25th hour.
assert.equal(tehranTimeRange("2026-09-27T20:00:00Z", 1), "۰۰:۰۰ الی ۰۱:۰۰");

// The Tehran date, not the UTC one: 20:00Z is already the 28th in Tehran, and
// 21:00 Tehran on the 27th is 17:00Z the same day.
assert.equal(tehranDateISO("2026-09-27T17:00:00Z"), "2026-09-27");
assert.equal(tehranDateISO("2026-09-27T20:00:00Z"), "2026-09-28");

assert.equal(FORMAT_LABELS.AMERICANO, "آمریکانو");
assert.equal(FORMAT_LABELS.OPEN_MATCH, "دوستانه");

// isSchedulable: Tehran 18:00 on 09-20 is stored as 14:00Z, and the API locks a
// match an hour before that — so the slot closes at 13:00Z, 90 minutes before
// the match really starts.
assert.equal(isSchedulable("2026-09-20", "18:00", Date.parse("2026-09-20T12:59:00Z")), true);
assert.equal(isSchedulable("2026-09-20", "18:00", Date.parse("2026-09-20T13:00:00Z")), false);

// Invite failures: raw keys never reach the screen; Persian passes, digits converted.
assert.equal(inviteFailureText("matchmaking.invite.alreadyInvited"), "قبلاً به این مچ دعوت شده است.");
assert.equal(inviteFailureText("matchmaking.invite.somethingNew"), "دعوت ارسال نشد.");
assert.equal(inviteFailureText("شماره موبایل «0912» معتبر نیست"), "شماره موبایل «۰۹۱۲» معتبر نیست");
assert.equal(inviteFailureText(null), "دعوت ارسال نشد.");

console.log("createMatch mapping: ok");
