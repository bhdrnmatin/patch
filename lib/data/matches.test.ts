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
import { toDetailsStatus, toListItem, toStatus, viewerParticipation, viewerRole } from "./matches";
import type { MatchResponse } from "../api/types";

const hour = 3600_000;
// A stored `scheduledAt` for a match really starting `ms` from now — the API
// copy sits 30 minutes early (API_SHIFT_MS in lib/api/matches.ts).
const at = (ms: number) => new Date(Date.now() + ms - 0.5 * hour).toISOString();

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
assert.equal(withPlayer.club, undefined, "no club when the lookup did not resolve one");
assert.equal(toListItem(m(), "پدل‌پوینت").club, "پدل‌پوینت");

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

// toDetailsStatus picks which of the three detail frames a match is in. The page
// used to read this from a query param, so every visitor saw "upcoming".
assert.equal(toDetailsStatus(m({ scheduledAt: at(2 * hour) })), "upcoming");
assert.equal(toDetailsStatus(m({ scheduledAt: at(-0.5 * hour), durationHours: 1 })), "live",
  "started but the hour has not elapsed");
assert.equal(toDetailsStatus(m({ scheduledAt: at(-3 * hour), durationHours: 1 })), "finished");
assert.equal(toDetailsStatus(m({ status: "CANCELLED", scheduledAt: at(2 * hour) })), "finished",
  "cancelled outranks the clock — there is nothing left to do with it");
assert.equal(toDetailsStatus(m({ status: "WHATEVER", scheduledAt: at(2 * hour) })), "upcoming",
  "an unknown status must not throw or mislabel");

// viewerRole — both branches, because "creator" used to be the fallback when the
// page read ?role= from the URL. A creator view on its own proves nothing.
assert.equal(viewerRole("acc-1", "acc-1"), "creator");
assert.equal(viewerRole("acc-1", "acc-2"), "player", "someone else's match");
assert.equal(viewerRole("acc-1", null), "player", "signed out / undecodable token");
assert.notEqual(viewerRole("acc-1", "acc-2"), "creator",
  "must not fall back to creator, which is what the old URL default did");

// Participant status drives two different things and they must not blur: a
// CONFIRMED row is a player on the roster, a REQUESTED row is someone waiting at
// the door. Both values observed live 2026-09-14; the spec declares neither.
{
  const roster = [
    participant({ id: "p1", status: "CONFIRMED", firstName: "متین ", lastName: "بهادران" }),
    participant({ id: "p2", status: "REQUESTED", firstName: "متیوس ", lastName: "دلیخت" }),
    participant({ id: "p3", status: "REJECTED", firstName: "کسی ", lastName: "دیگر" }),
  ];
  const confirmed = roster.filter((p) => p.status === "CONFIRMED");
  const requested = roster.filter((p) => p.status === "REQUESTED");
  assert.equal(confirmed.length, 1, "only CONFIRMED counts toward the roster");
  assert.equal(requested.length, 1, "only REQUESTED is a pending request");
  assert.equal(requested[0].id, "p2", "the request carries the participant id, not the account id");
  // A rejected row is neither — it must not appear as a player or as a request.
  assert.equal(roster.filter((p) => ["CONFIRMED", "REQUESTED"].includes(p.status)).length, 2);
}

// viewerParticipation decides which CTA a player gets. Before this existed the
// button came from role+stage alone, so a stranger was offered "cancel my
// request" for a request they had never made.
{
  const me = "acc-me";
  const rows = [
    participant({ id: "p1", accountId: "acc-other", status: "CONFIRMED" }),
    participant({ id: "p2", accountId: me, status: "REQUESTED" }),
  ];
  assert.deepEqual(viewerParticipation(rows, me), { state: "requested", participantId: "p2" });
  assert.deepEqual(viewerParticipation(rows, "acc-nobody"), { state: "none" });
  assert.deepEqual(viewerParticipation(rows, null), { state: "none" }, "signed out");
  assert.deepEqual(viewerParticipation([], me), { state: "none" }, "empty roster");
  assert.deepEqual(
    viewerParticipation([participant({ id: "p3", accountId: me, status: "CONFIRMED" })], me),
    { state: "confirmed", participantId: "p3" },
  );
  // A status we have never seen must not be read as being in the match — the
  // safe reading offers to join rather than to leave.
  assert.deepEqual(
    viewerParticipation([participant({ id: "p4", accountId: me, status: "REJECTED" })], me),
    { state: "none" },
  );
}

console.log("matches list mapping: ok");
