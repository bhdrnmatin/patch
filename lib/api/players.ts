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

/** Set name + gender (profile-setup and the edit flow). */
export function updateProfile(body: UpdateProfileRequest): Promise<PlayerResponse> {
  return apiFetch<PlayerResponse>("/players/me/profile", { method: "PUT", body });
}

/** Set the bio / display info. */
export function updateDisplayInfo(body: UpdateDisplayInfoRequest): Promise<PlayerResponse> {
  return apiFetch<PlayerResponse>("/players/me/display-info", { method: "PUT", body });
}

export function updatePhotoVisibility(visibility: string): Promise<PlayerResponse> {
  return apiFetch<PlayerResponse>("/players/me/profile-photo/visibility", {
    method: "PUT",
    body: { visibility },
  });
}

export function uploadProfilePhoto(file: File): Promise<PlayerResponse> {
  const form = new FormData();
  form.append("file", file);
  return apiFetch<PlayerResponse>("/players/me/profile-photo", { method: "POST", form });
}
