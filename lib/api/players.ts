import { apiFetch } from "./client";
import type {
  PlayerResponse,
  UpdateDisplayInfoRequest,
  UpdateProfileRequest,
} from "./types";

/** Current authenticated player. */
export function getMe(): Promise<PlayerResponse> {
  return apiFetch<PlayerResponse>("/players/me");
}

/** Update the profile — all of firstName/lastName/gender/residenceCityId are required. */
export function updateProfile(body: UpdateProfileRequest): Promise<PlayerResponse> {
  return apiFetch<PlayerResponse>("/players/me/profile", { method: "PUT", body });
}

/** Set the bio / display info. */
export function updateDisplayInfo(body: UpdateDisplayInfoRequest): Promise<PlayerResponse> {
  return apiFetch<PlayerResponse>("/players/me/display-info", { method: "PUT", body });
}

export function uploadProfilePhoto(file: File): Promise<PlayerResponse> {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<PlayerResponse>("/players/me/profile-photo", { method: "POST", form });
}
