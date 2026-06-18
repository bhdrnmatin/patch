import { matchDetails } from "@/lib/mock";

// Write-side seam — the twin of the read accessors in this folder. Today each
// mutates the in-memory mock so an invalidated query refetches changed data;
// when the API is ready, swap each body for the matching POST/PATCH/DELETE.

const delay = (ms = 400) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Accept or reject a pending join request (creator action). */
export async function respondToJoinRequest({
  matchId,
  requestId,
  accept,
}: {
  matchId: string;
  requestId: string;
  accept: boolean;
}): Promise<void> {
  // Single mock match for now; the real endpoint keys off `matchId`.
  void matchId;
  await delay();

  const request = matchDetails.requests.find((r) => r.id === requestId);
  matchDetails.requests = matchDetails.requests.filter((r) => r.id !== requestId);

  if (accept && request && matchDetails.filled < matchDetails.capacity) {
    matchDetails.players = [
      ...matchDetails.players,
      { name: request.name, level: request.level, avatar: request.avatar },
    ];
    matchDetails.filled += 1;
  }
}
