import { matchDetails, matchList, pickablePlayers } from "@/lib/mock";
import { JALALI_MONTHS, isoToJalali } from "@/lib/jalali";
import { toPersianDigits } from "@/lib/persian";
import type { CreateMatchDraft, MatchPlayer } from "@/lib/types";

/** "۱۴ مرداد" from an ISO gregorian date, for the match-list card. */
function dayMonthLabel(iso: string): string {
  const { jm, jd } = isoToJalali(iso);
  return `${toPersianDigits(String(jd))} ${JALALI_MONTHS[jm - 1]}`;
}

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

/** Create a match from the wizard draft; returns the new match id. */
export async function createMatch(draft: CreateMatchDraft): Promise<string> {
  await delay();

  const self: MatchPlayer = { name: "سینا عشاقی", level: 3, avatar: "/images/avatar-placeholder.svg" };
  const teammates = draft.teammates
    .filter((t): t is number => t !== null)
    .map((i) => pickablePlayers[i]);
  const players = [self, ...teammates];

  const id = `ml-${Date.now()}`;
  matchList.unshift({
    id,
    title: draft.title,
    status: "active",
    players,
    avgLevel: Math.round(players.reduce((sum, p) => sum + p.level, 0) / players.length),
    capacity: 4,
    date: draft.date ? dayMonthLabel(draft.date) : "",
    price: (draft.entryFee.enabled && draft.entryFee.value) || 0,
  });
  return id;
}
