/**
 * Pins the MatchResponse → MatchListItem mapping.
 *
 * Everything here exists because the API and the card disagree: the API has no
 * levels and no prices, its `status` is an undeclared string, and it stores
 * names with stray whitespace.
 *
 * Run: npx tsx lib/data/matches.test.ts
 */
import assert from "node:assert/strict";
import { toListItem, toStatus } from "./matches";
import type { MatchResponse } from "../api/types";

const hour = 3600_000;
const at = (ms: number) => new Date(Date.now() + ms).toISOString();

const m = (over: Partial<MatchResponse> = {}): MatchResponse => ({
  id: "m1",
  organizer: { accountId: "a1", photoUrl: null, firstName: "متین ", lastName: "بهادران" },
  format: "OPEN_MATCH",
  matchType: "FRIENDLY",
  title: "پدل عصر",
  description: null,
  capacity: 4,
  clubId: "c1",
  courtLabel: null,
  scheduledAt: at(24 * hour),
  durationHours: 1,
  visibility: "PUBLIC",
  joinPolicy: "OPEN",
  status: "OPEN",
  inviteToken: null,
  participants: null,
  ...over,
});

// status: only CANCELLED is trusted by name; the rest comes off the clock,
// so an undocumented enum value can't silently mislabel a card.
assert.equal(toStatus(m({ status: "CANCELLED" })), "not-held");
assert.equal(toStatus(m({ scheduledAt: at(24 * hour) })), "active", "future");
assert.equal(toStatus(m({ scheduledAt: at(-24 * hour) })), "held", "well past");
assert.equal(toStatus(m({ scheduledAt: at(-0.5 * hour), durationHours: 1 })), "active",
  "still being played — start is past but the hour has not elapsed");
assert.equal(toStatus(m({ status: "SOMETHING_NEW" })), "active",
  "an unknown status must not throw or mislabel");

// The API stores firstName with a trailing space, so a naive join double-spaces.
const participant = (over = {}) => ({
  id: "p1",
  matchId: "m1",
  accountId: "a1",
  status: "CONFIRMED",
  joinChannel: "OPEN",
  requestedAt: "2026-09-13T14:59:51Z",
  decidedAt: "2026-09-13T14:59:51Z",
  photoUrl: null,
  firstName: "متین ",
  lastName: "بهادران",
  ...over,
});

const withPlayer = toListItem(m({ participants: [participant()] }));
assert.equal(withPlayer.players[0].name, "متین بهادران");

// The three fields the API cannot supply stay undefined — never 0.
assert.equal(withPlayer.avgLevel, undefined, "no level source anywhere in the API");
assert.equal(withPlayer.price, undefined, "no price field anywhere in the API");
assert.equal(withPlayer.players[0].level, undefined);

// participants is null on create and on some list rows.
assert.deepEqual(toListItem(m({ participants: null })).players, []);

// title is nullable in the response even though creating without one 500s.
assert.equal(toListItem(m({ title: null })).date, toListItem(m({ title: null })).title,
  "a titleless match falls back to its date label");

assert.equal(toListItem(m()).capacity, 4);

console.log("matches list mapping: ok");
