// Auth token storage. Tokens come from POST /otp/verify and are sent as
// `Authorization: Bearer`. Kept in localStorage — this is a fully client-rendered
// PWA with no server session. All access is SSR-guarded so importing modules on
// the server (layouts, RSC) doesn't throw.

const ACCESS_KEY = "patch.accessToken";
const REFRESH_KEY = "patch.refreshToken";

type Listener = () => void;
const listeners = new Set<Listener>();

/** Notify subscribers (the auth hook) after any token change. */
function emit() {
  for (const fn of listeners) fn();
}

/** Subscribe to login/logout changes; returns an unsubscribe fn. */
export function subscribeSession(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  emit();
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  emit();
}

export function hasSession(): boolean {
  return getAccessToken() !== null;
}
