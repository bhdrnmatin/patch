import { API_PREFIX } from "./config";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpired,
  setTokens,
} from "./session";

/** A non-2xx API response. `body` is the parsed error payload when present. */
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** JSON body — serialized automatically. Ignored when `form` is set. */
  body?: unknown;
  /** multipart/form-data body; the browser sets the boundary content-type. */
  form?: FormData;
  /** Attach the bearer token. Default true; pass false for public endpoints. */
  auth?: boolean;
  /** Internal: set on the single replay after a token refresh (prevents loops). */
  _retry?: boolean;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// The API wraps errors as { details, errorCode, errorMessage, extraInfo } — the
// human message is in `errorMessage` (fall back to `message`, then a generic one).
function errorMessageOf(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.errorMessage === "string" && d.errorMessage) return d.errorMessage;
    if (typeof d.message === "string" && d.message) return d.message;
  }
  return `خطای سرور (${status})`;
}

// --- Token refresh (rotating) -------------------------------------------------
// Single-flight: concurrent 401s (or proactive refreshes) share one in-flight
// /auth/refresh call rather than each firing their own.
let refreshInFlight: Promise<boolean> | null = null;

function refreshTokens(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function doRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    // Raw fetch (not apiFetch) so it can never recurse through the 401 path.
    const res = await fetch(`${API_PREFIX}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => null);
    // Rotating refresh: the response carries a fresh access AND refresh token.
    if (data && typeof data.accessToken === "string" && typeof data.refreshToken === "string") {
      setTokens(data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function endSession(): void {
  clearSession();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

/**
 * Fetch a same-origin `/api/v1` path (proxied to the upstream API by
 * next.config.ts). Throws {@link ApiError} on non-2xx. Keeps the session alive
 * across the short access-token TTL: refreshes a known-expired token before the
 * request, and on a 401 refreshes once and replays. Only when the refresh token
 * itself is invalid does it clear the session and bounce to /login.
 */
export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, form, auth = true, _retry = false } = opts;

  // Proactive: if the access token is already expired, refresh before spending a
  // request on a guaranteed 401 (tokens are short-lived).
  if (auth && !_retry && isAccessTokenExpired() && getRefreshToken()) {
    await refreshTokens();
  }

  const headers: Record<string, string> = {};
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let payload: BodyInit | undefined;
  if (form) {
    payload = form; // do NOT set Content-Type — the browser adds the boundary
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_PREFIX}${path}`, { method, headers, body: payload });

  if (res.status === 401 && auth) {
    // Reactive: refresh once and replay the request. If refresh fails (or the
    // replay still 401s), the refresh token is dead — end the session.
    if (!_retry && (await refreshTokens())) {
      return apiFetch<T>(path, { ...opts, _retry: true });
    }
    endSession();
    throw new ApiError(401, "نشست شما منقضی شده است.", null);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, errorMessageOf(data, res.status), data);
  }

  return data as T;
}
