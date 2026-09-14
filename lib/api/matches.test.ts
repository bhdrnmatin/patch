/**
 * Pins the awkward parts of the wizard-draft → POST /matches mapping.
 *
 * Every case here exists because the API disagrees with the wizard somewhere;
 * the reasons are in `_designer/api-findings.md` and in `matches.ts`.
 *
 * Run: npx tsx lib/api/matches.test.ts
 */
import assert from "node:assert/strict";
import { draftToCreateRequest, tehranTimeRange, FORMAT_LABELS } from "./matches";
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

// Step ۱ requires a title now, so this is the backstop for older saved drafts —
// an empty title reaches the API as a 500, not a validation error.
assert.equal(draftToCreateRequest(d()).title, "مچ ۲۹ شهریور", "jalali, and in Persian digits");
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

// scheduledAt carries Tehran's offset — a naive string is unparseable to the API.
assert.equal(draftToCreateRequest(d()).scheduledAt, "2026-09-20T18:00:00+03:30");
// The picker's last slot is midnight, which belongs to the next day.
assert.equal(draftToCreateRequest(d({ time: "24:00" })).scheduledAt, "2026-09-21T00:00:00+03:30");

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

// tehranTimeRange: the API stores a UTC instant and Iran is a fixed +03:30, so
// the hours a player reads are always shifted from what is stored.
assert.equal(tehranTimeRange("2026-09-27T11:00:00Z", 1), "۱۴:۳۰ الی ۱۵:۳۰");
assert.equal(tehranTimeRange("2026-09-27T14:30:00Z", 2), "۱۸:۰۰ الی ۲۰:۰۰");
// Crossing midnight must not wrap to a negative or a 25th hour.
assert.equal(tehranTimeRange("2026-09-27T20:30:00Z", 1), "۰۰:۰۰ الی ۰۱:۰۰");

assert.equal(FORMAT_LABELS.AMERICANO, "آمریکانو");
assert.equal(FORMAT_LABELS.OPEN_MATCH, "دوستانه");

console.log("createMatch mapping: ok");
