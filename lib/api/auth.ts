import { apiFetch } from "./client";
import { clearSession, getRefreshToken, setTokens } from "./session";
import type { RequestOtpResponse, VerifyOtpResponse } from "./types";

/** Send an OTP code to the phone number. Public (no bearer yet). */
export function requestOtp(phoneNumber: string): Promise<RequestOtpResponse> {
  return apiFetch<RequestOtpResponse>("/otp/request", {
    method: "POST",
    body: { phoneNumber },
    auth: false,
  });
}

/** Verify the OTP; on success persists the returned tokens. */
export async function verifyOtp(phoneNumber: string, code: string): Promise<VerifyOtpResponse> {
  const tokens = await apiFetch<VerifyOtpResponse>("/otp/verify", {
    method: "POST",
    body: { phoneNumber, code },
    auth: false,
  });
  setTokens(tokens);
  return tokens;
}

/** Revoke the current refresh token server-side, then clear the local session. */
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiFetch<void>("/auth/logout", { method: "POST", body: { refreshToken } });
    }
  } finally {
    clearSession();
  }
}
