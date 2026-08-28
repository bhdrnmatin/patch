// Auth token storage. Tokens come from POST /otp/verify and are sent as
// `Authorization: Bearer`. Kept in localStorage — this is a fully client-rendered
// PWA with no server session. All access is SSR-guarded so importing modules on
// the server (layouts, RSC) doesn't throw.

/**
 * The fake access token handed out by /dev-login. The API always rejects it —
 * the point is to get past the client-side guards onto mock data while the
 * backend is unreachable. Exported so the 401 handler can tell it apart from a
 * real token the server has rejected. Delete with app/dev-login/.
 */
export const DEV_BYPASS_TOKEN = "dev-bypass";

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

/** Read the `exp` (ms) from a JWT access token, or null if not decodable. */
function accessTokenExpiryMs(): number | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * True only when there's no token or its `exp` has passed. A non-decodable
 * token is treated as NOT expired — let the server be the judge. Used to tell a
 * genuine "session ended" from a transient backend 401.
 */
export function isAccessTokenExpired(): boolean {
  if (!getAccessToken()) return true;
  const exp = accessTokenExpiryMs();
  return exp !== null && exp <= Date.now();
}
