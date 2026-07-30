// Unread notification counts keyed by route — drives the red dot on the
// BottomNav tabs. Empty today (no notifications backend yet); when the API (or
// a websocket) exists, swap the body for the real source. The query key and
// callers don't change.
export async function getUnreadCounts(): Promise<Record<string, number>> {
  return {};
}
