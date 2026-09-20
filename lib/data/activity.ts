import { getMatch, getMyInvitations, tehranTimeRange } from "@/lib/api/matches";
import { getClubs } from "@/lib/api/clubs";
import { jalaliDayMonth } from "@/lib/jalali";
import { tehranDateISO } from "@/lib/api/matches";
import { toDetailsStatus } from "./matches";
import type { ActivitySection } from "@/lib/types";

/**
 * Live since 2026-09-19: the invitations sent to the signed-in player.
 *
 * This is the page's whole purpose for now. An invite used to arrive by SMS and
 * then exist nowhere in the app — the invitee could only find the match by
 * searching the list, and «رفتن به مَچ» from the wizard was the organizer's only
 * evidence it had been sent.
 *
 * `GET /matches/invitations/me` carries a `matchId` and nothing else, so each
 * pending invitation costs a `GET /matches/{id}`. They run in parallel and there
 * are only ever a handful; a batch endpoint would be the fix if that changes.
 * A match that 404s (cancelled and swept, say) drops its card rather than
 * failing the page.
 */
export async function getActivitySections(): Promise<ActivitySection[]> {
  const { content } = await getMyInvitations();
  const pending = content.filter((i) => i.status === "PENDING");
  if (pending.length === 0) return [];

  const clubs = await getClubs();
  const cards = await Promise.all(
    pending.map(async (invite) => {
      const match = await getMatch(invite.matchId).catch(() => null);
      // An invitation outlives its match: cancelling one leaves every invitation
      // PENDING for ever, so without this the card — and the nav's dot — sat
      // there offering to join a match that no longer happens.
      if (!match || toDetailsStatus(match) !== "upcoming") return null;
      const club = clubs.content.find((c) => c.id === match.clubId);
      return {
        id: invite.id,
        matchId: match.id,
        image: "/images/hero-court.webp",
        status: "دعوت به مَچ",
        title: [match.title ?? jalaliDayMonth(tehranDateISO(match.scheduledAt))],
        meta: [
          {
            text: `${jalaliDayMonth(tehranDateISO(match.scheduledAt))} · ${tehranTimeRange(match.scheduledAt, match.durationHours)}`,
            tone: "strong" as const,
          },
          { text: club?.name ?? "—", tone: "muted" as const },
          {
            text: `دعوت از ${match.organizer.firstName} ${match.organizer.lastName}`.trim(),
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

  const items = cards.filter((c) => c !== null);
  return items.length > 0 ? [{ heading: { right: "دعوت‌ها" }, items }] : [];
}
