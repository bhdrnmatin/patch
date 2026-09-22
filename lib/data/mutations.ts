import {
  createMatch as apiCreateMatch,
  decideParticipant,
  draftToCreateRequest,
  inviteByPhone,
  inviteFailureText,
  removeParticipant,
} from "@/lib/api/matches";
import type { CreateMatchDraft, MatchPlayer } from "@/lib/types";

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
 * Remove a player from the roster (creator action). `participantId` is the same
 * id space `respondToJoinRequest` uses. The caller invalidates `matchDetails`.
 */
export async function removePlayer(matchId: string, participantId: string): Promise<void> {
  await removeParticipant(matchId, participantId);
}

/** A phone the wizard couldn't invite, with the reason to show. */
export interface FailedInvite {
  phone: string;
  reason: string;
}

/**
 * Create a match from the wizard draft, then invite its phone numbers.
 *
 * `inviteToken` comes straight off the create response, so the wizard's success
 * step can share the join link without a second read of the match.
 *
 * Invites can only go to a match that exists, so they're a second request, and
 * a failure there must not read as "the match failed" — it was created. They
 * come back as `failedInvites` for the wizard to show instead.
 *
 * Both kinds of teammate go out the same way, by phone: the API still refuses
 * account ids (re-probed 2026-09-19), and a picked player carries the number the
 * suggestion came with. Dropping a duplicate keeps one typed number and the same
 * person picked from the list from becoming two invites, one of which the server
 * would refuse as `alreadyInvited`.
 */
export async function createMatch(
  draft: CreateMatchDraft,
  players: MatchPlayer[],
): Promise<{ id: string; inviteToken?: string; failedInvites: FailedInvite[] }> {
  const { id, inviteToken } = await apiCreateMatch(draftToCreateRequest(draft));
  const created = { id, inviteToken: inviteToken ?? undefined };

  const phones = [
    ...new Set(
      draft.teammates.flatMap((t) =>
        t.kind === "invite" ? [t.phone] : (players[t.index]?.phone ?? []),
      ),
    ),
  ];
  if (phones.length === 0) return { ...created, failedInvites: [] };

  try {
    const results = await inviteByPhone(id, phones);
    const failedInvites = results
      .filter((r) => !r.success)
      .map((r) => ({ phone: r.phoneNumber, reason: inviteFailureText(r.failureMessage) }));
    return { ...created, failedInvites };
  } catch (e) {
    // The server's own reason when it answered; apiFetch's connection message
    // (status 0) when it didn't. A 2026-09-17 failure said «اتصال» while the
    // invite had in fact been created, so don't guess.
    const reason = e instanceof Error && e.message ? e.message : "دعوت ارسال نشد.";
    return { ...created, failedInvites: phones.map((phone) => ({ phone, reason })) };
  }
}
