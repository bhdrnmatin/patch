import { apiFetch } from "./client";
import type { ClubResponse, PageResponse } from "./types";

/**
 * Clubs, newest page first. The app supports one city (البرز/کرج) and there are
 * five clubs in it, so a single oversized page stands in for pagination.
 * ponytail: pass cityId + real paging when a second city ships.
 */
let clubs: Promise<PageResponse<ClubResponse>> | null = null;

/**
 * Fetched once per session and shared. The call takes ~0.85s (2026-09-24) and
 * the list, every match page, /activity and the wizard all wanted it — so
 * opening a match waited on clubs, not on the match. Five clubs that only an
 * admin changes don't need refetching; a failure clears the slot so the next
 * caller retries.
 * ponytail: session-long cache — add a TTL if clubs start changing under a
 * running app.
 */
export function getClubs(): Promise<PageResponse<ClubResponse>> {
  clubs ??= apiFetch<PageResponse<ClubResponse>>("/clubs?size=100").catch((e) => {
    clubs = null;
    throw e;
  });
  return clubs;
}
