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
