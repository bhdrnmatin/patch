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
export interface PlayerResponse {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  avatarUrl: string;
  bio: string;
  status: string;
  profileStatus: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  gender: string;
}

export interface UpdateDisplayInfoRequest {
  bio: string;
}

export interface ProfilePhotoVisibilityRequest {
  visibility: string;
}
