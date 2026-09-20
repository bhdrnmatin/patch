import { getActivity, isMatchActivity } from "@/lib/api/activity";
import { getMatch, getMyInvitations, tehranDateISO, tehranTimeRange } from "@/lib/api/matches";
import { getClubs } from "@/lib/api/clubs";
import { jalaliDayMonth } from "@/lib/jalali";
import { fullName, toDetailsStatus } from "./matches";
import type { ActivityItem, ActivitySection } from "@/lib/types";
import { toPersianDigits } from "@/lib/persian";
import type { MatchResponse } from "@/lib/api/types";

/**
 * The two things worth a player's attention: invitations waiting for an answer,
 * and the matches they are part of.
 *
 * They come from different endpoints because only one of them can be answered.
 * `GET /activity` (2026-09-20) serves the feed — each row carries the **whole
 * match**, so naming it costs nothing — but an invitation is not in it, and
 * accepting is addressed to the invitation's own id. So invitations stay on
 * `GET /matches/invitations/me`, which is also the only list that can be
 * answered from here.
 *
 * Unknown feed rows are skipped, not guessed at: the backend can add kinds
 * without this page inventing a card for them.
 */
export async function getActivitySections(): Promise<ActivitySection[]> {
  const [invitations, feed, clubs] = await Promise.all([
    getMyInvitations().catch(() => null),
    getActivity().catch(() => null),
    getClubs(),
  ]);

  const clubName = (id: string) => clubs.content.find((c) => c.id === id)?.name ?? "—";

  const invites = await invitationCards(invitations?.content ?? [], clubName);
  const matches = (feed?.content ?? [])
    .filter(isMatchActivity)
    .map((row) => matchCard(row.detail.match, row.detail.role, clubName))
    // A match you were invited to and have not answered is in neither list
    // twice: the feed only carries matches you are already part of.
    .filter((card) => !invites.some((i) => i.matchId === card.matchId));

  return [
    invites.length > 0 ? { heading: { right: "دعوت‌ها" }, items: invites } : null,
    matches.length > 0 ? { heading: { right: "مَچ‌های شما" }, items: matches } : null,
  ].filter((s) => s !== null);
}

/**
 * The invitations still worth answering.
 *
 * An invitation outlives its match — cancelling one leaves every invitation
 * PENDING for ever, with no sweep — so a card is only drawn for a match that is
 * still ahead. The feed can't replace this: it carries no invitation rows, and
 * accepting needs the invitation id, which only this endpoint gives.
 *
 * `GET /matches/invitations/me` names no match, so each pending one costs a
 * `GET /matches/{id}`. They run in parallel and there are only ever a handful.
 */
async function invitationCards(
  invitations: { id: string; matchId: string; status: string }[],
  clubName: (id: string) => string,
): Promise<ActivityItem[]> {
  const pending = invitations.filter((i) => i.status === "PENDING");
  const cards = await Promise.all(
    pending.map(async (invite) => {
      const match = await getMatch(invite.matchId).catch(() => null);
      if (!match || toDetailsStatus(match) !== "upcoming") return null;
      return {
        kind: "invitation" as const,
        id: invite.id,
        matchId: match.id,
        image: "/images/hero-court.webp",
        status: "دعوت به مَچ",
        title: [matchTitle(match)],
        meta: [
          { text: whenLine(match), tone: "strong" as const },
          { text: clubName(match.clubId), tone: "muted" as const },
          {
            text: `دعوت از ${fullName(match.organizer.firstName, match.organizer.lastName)}`,
            tone: "faint" as const,
          },
        ],
        // No «رد کردن»: DELETE on an invitation is the *organizer* cancelling one
        // they sent (403 for the invitee, probed 2026-09-19), and the API has no
        // invitee-side decline. Looking before accepting is the honest second action.
        actions: [
          { label: "مشاهده مَچ", variant: "outline" as const, kind: "open-match" as const },
          { label: "پذیرفتن", variant: "filled" as const, kind: "accept-invite" as const },
        ],
      };
    }),
  );
  return cards.filter((c) => c !== null);
}

/** A match you are in. The role is the API's; only ORGANIZER has been seen. */
function matchCard(match: MatchResponse, role: string, clubName: (id: string) => string): ActivityItem {
  const confirmed = (match.participants ?? []).filter((p) => p.status === "CONFIRMED").length;
  return {
    kind: "match",
    // The feed has no row id of its own, and one match is one card.
    id: match.id,
    matchId: match.id,
    image: "/images/hero-court.webp",
    status: role === "ORGANIZER" ? "برگزار کننده" : "بازیکن",
    title: [matchTitle(match)],
    meta: [
      { text: whenLine(match), tone: "strong" },
      { text: clubName(match.clubId), tone: "muted" },
      { text: `${toPersianDigits(String(confirmed))} از ${toPersianDigits(String(match.capacity))} بازیکن`, tone: "faint" },
    ],
    actions: [{ label: "مشاهده مَچ", variant: "outline", kind: "open-match" }],
  };
}

const matchTitle = (m: MatchResponse) => m.title ?? jalaliDayMonth(tehranDateISO(m.scheduledAt));

const whenLine = (m: MatchResponse) =>
  `${jalaliDayMonth(tehranDateISO(m.scheduledAt))} · ${tehranTimeRange(m.scheduledAt, m.durationHours)}`;
