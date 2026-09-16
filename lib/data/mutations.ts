import { createMatch as apiCreateMatch, decideParticipant, draftToCreateRequest } from "@/lib/api/matches";
import type { CreateMatchDraft } from "@/lib/types";

// Write-side seam — the twin of the read accessors in this folder. Callers
// invalidate their queries afterwards, so changed data comes back from the server.

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

/**
 * Create a match from the wizard draft; returns the new match id.
 *
 * Only the match itself goes up. Teammates are picked from the mock
 * `pickablePlayers`, which have no account ids, and phone invites have no wired
 * endpoint yet — both stay in the draft and are dropped here (see TODO.md).
 */
export async function createMatch(draft: CreateMatchDraft): Promise<string> {
  const { id } = await apiCreateMatch(draftToCreateRequest(draft));
  return id;
}
