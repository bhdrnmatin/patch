import {
  createMatch as apiCreateMatch,
  decideParticipant,
  draftToCreateRequest,
  inviteByPhone,
  inviteFailureText,
} from "@/lib/api/matches";
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

/** A phone the wizard couldn't invite, with the reason to show. */
export interface FailedInvite {
  phone: string;
  reason: string;
}

/**
 * Create a match from the wizard draft, then invite its phone numbers.
 *
 * Invites can only go to a match that exists, so they're a second request, and
 * a failure there must not read as "the match failed" — it was created. They
 * come back as `failedInvites` for the wizard to show instead.
 *
 * Patch-player teammates aren't sent: the pick list is still the mock, and the
 * API invites by phone only (asked the backend for account ids; see TODO.md).
 */
export async function createMatch(
  draft: CreateMatchDraft,
): Promise<{ id: string; failedInvites: FailedInvite[] }> {
  const { id } = await apiCreateMatch(draftToCreateRequest(draft));

  const phones = draft.teammates.flatMap((t) => (t.kind === "invite" ? [t.phone] : []));
  if (phones.length === 0) return { id, failedInvites: [] };

  try {
    const results = await inviteByPhone(id, phones);
    const failedInvites = results
      .filter((r) => !r.success)
      .map((r) => ({ phone: r.phoneNumber, reason: inviteFailureText(r.failureMessage) }));
    return { id, failedInvites };
  } catch {
    return {
      id,
      failedInvites: phones.map((phone) => ({ phone, reason: "دعوت ارسال نشد. اتصال را بررسی کنید." })),
    };
  }
}
