// Wire shapes for api.patchapp.ir (/api/v1). Kept separate from the UI
// view-models in lib/types.ts — map between them at the call site.

export interface RequestOtpResponse {
  nextResendAllowedAt: string; // ISO date-time
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
}

// profileStatus distinguishes a freshly-verified user (needs profile-setup)
// from a complete one; exact string values are confirmed against a live /me.
export type PreferredSide = "RIGHT" | "LEFT";

export interface PlayerResponse {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  residenceCityId: string;
  username: string; // backend still returns it; no longer shown/sent — removal pending
  preferredSide?: PreferredSide;
  avatarUrl: string;
  bio: string;
  status: string;
  profileStatus: string;
}

// All fields are required by the API.
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  gender: string;
  residenceCityId: string;
}

export interface ProvinceResponse {
  id: string;
  name: string;
  telPrefix: string;
}

export interface CityResponse {
  id: string;
  name: string;
}

export interface UpdateDisplayInfoRequest {
  bio?: string;
  preferredSide?: PreferredSide;
}

export interface ClubResponse {
  id: string;
  cityId: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  description?: string;
  bannerUrl?: string;
  logoUrl?: string;
  status: string;
}

/** Every list endpoint on this API pages the same way. */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}

/* ── Matches ────────────────────────────────────────────────────────────────
 * Shapes from `GET /v3/api-docs`, verified against the live API 2026-09-12.
 * Constraints the spec states and a probe confirmed:
 *   · `matchType: COMPETITIVE` → 400 «مسابقات رقابتی هنوز فعال نشده‌اند»
 *   · a missing `title` → 500, so it is required in practice
 *   · `capacity` minimum 4, `durationHours` minimum 1
 *   · `scheduledAt` is a java.time.Instant and must have zero UTC minutes
 */

export type ApiMatchFormat = "OPEN_MATCH" | "AMERICANO" | "MEXICANO";
export type ApiMatchType = "FRIENDLY" | "COMPETITIVE";
export type ApiVisibility = "PUBLIC" | "PRIVATE";
export type ApiJoinPolicy = "OPEN" | "MANUAL_APPROVE" | "INVITE_LINK_ONLY";

export interface CreateMatchRequest {
  format: ApiMatchFormat;
  matchType: ApiMatchType;
  clubId: string;
  /** ISO instant with an offset. Naive local time is rejected as unparseable. */
  scheduledAt: string;
  visibility: ApiVisibility;
  joinPolicy: ApiJoinPolicy;
  /** Declared optional; omitting it 500s. Max 80. */
  title: string;
  /** Declared optional; omitting it 400s. Minimum 4. */
  capacity: number;
  /** Declared optional; omitting it 400s. Minimum 1, integer. */
  durationHours: number;
  /** Max 500. */
  description?: string;
  /** Max 50. Not collected by the wizard. */
  courtLabel?: string;
  /** Does the organizer take a capacity slot? Defaults true when omitted. */
  organizerJoins?: boolean;
}

export interface MatchOrganizerResponse {
  accountId: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
}

export interface MatchParticipantResponse {
  accountId: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
}

export interface MatchResponse {
  id: string;
  organizer: MatchOrganizerResponse;
  format: ApiMatchFormat;
  matchType: ApiMatchType;
  title: string | null;
  description: string | null;
  capacity: number;
  clubId: string;
  courtLabel: string | null;
  scheduledAt: string;
  durationHours: number;
  visibility: ApiVisibility;
  joinPolicy: ApiJoinPolicy;
  status: string;
  inviteToken: string | null;
  /** null on create; populated by `GET /matches/{id}`. */
  participants: MatchParticipantResponse[] | null;
}

