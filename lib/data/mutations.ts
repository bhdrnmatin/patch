import { matchList, pickablePlayers } from "@/lib/mock";
import { decideParticipant } from "@/lib/api/matches";
import { jalaliDayMonth } from "@/lib/jalali";
import type { CreateMatchDraft, MatchPlayer } from "@/lib/types";

// Write-side seam — the twin of the read accessors in this folder. Today each
// mutates the in-memory mock so an invalidated query refetches changed data;
// when the API is ready, swap each body for the matching POST/PATCH/DELETE.

const delay = (ms = 400) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Accept or reject a pending join request (creator action).
 *
 * `requestId` is the **participant** id from `MatchDetails.requests`, which is
 * what the endpoint is addressed to. The caller invalidates `matchDetails`, so
 * the roster and the remaining requests both come back from the server rather
 * than being patched locally.
 */
export async function respondToJoinRequest({
  matchId,
  requestId,
  accept,
}: {
  matchId: string;
  requestId: string;
  accept: boolean;
}): Promise<void> {
  await decideParticipant(matchId, requestId, accept);
}

/** Mean skill level, or undefined when nobody has one (every API player). */
function averageLevel(players: MatchPlayer[]): number | undefined {
  const levels = players.map((p) => p.level).filter((l): l is number => l !== undefined);
  if (levels.length === 0) return undefined;
  return Math.round(levels.reduce((sum, l) => sum + l, 0) / levels.length);
}

/** Create a match from the wizard draft; returns the new match id. */
export async function createMatch(draft: CreateMatchDraft): Promise<string> {
  await delay();

  const self: MatchPlayer = { name: "سینا عشاقی", level: 3, avatar: "/images/avatar-placeholder.svg" };
  // Only teammates already on Patch join the roster. Phone invites are collected
  // in the draft but can't be sent yet — no endpoint (see TODO.md) — so an
  // invited number stays out of the player list until it accepts.
  const teammates = draft.teammates.flatMap((t) =>
    t.kind === "player" ? [pickablePlayers[t.index]] : []
  );
  const players = [self, ...teammates];

  const id = `ml-${Date.now()}`;
  matchList.unshift({
    id,
    title: draft.title,
    status: "active",
    players,
    avgLevel: averageLevel(players),
    // رقابتی is always 2v2; the other formats have no fixed size, so the roster
    // it was created with is the only capacity we can claim.
    capacity: draft.format === "competitive" ? 4 : players.length,
    date: draft.date ? jalaliDayMonth(draft.date) : "",
    day: draft.date ?? "",
    // The wizard stopped collecting an entry fee (step ۵ is the join method
    // only), so everything created here is free until a pricing field returns.
    price: 0,
  });
  return id;
}
