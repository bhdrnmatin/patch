import { apiFetch } from "./client";
import type { ClubResponse, PageResponse } from "./types";

/**
 * Clubs, newest page first. The app supports one city (البرز/کرج) and there are
 * five clubs in it, so a single oversized page stands in for pagination.
 * ponytail: pass cityId + real paging when a second city ships.
 */
export function getClubs(): Promise<PageResponse<ClubResponse>> {
  return apiFetch<PageResponse<ClubResponse>>("/clubs?size=100");
}
