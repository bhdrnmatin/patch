import { getMyInvitations } from "@/lib/api/matches";

/**
 * Unread counts keyed by route — the red dot on the BottomNav tabs.
 *
 * Only `/activity` has a real source: the invitations waiting for an answer,
 * which is what that page shows. There is no notifications backend, so every
 * other route stays silent rather than inventing a number.
 *
 * A failure is not worth a broken nav on every page, so it counts as zero.
 */
export async function getUnreadCounts(): Promise<Record<string, number>> {
  const pending = await getMyInvitations()
    .then(({ content }) => content.filter((i) => i.status === "PENDING").length)
    .catch(() => 0);
  return pending > 0 ? { "/activity": pending } : {};
}
