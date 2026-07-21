import { API_PREFIX } from "./config";
import { clearSession, getAccessToken, isAccessTokenExpired } from "./session";

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

/**
 * Fetch a same-origin `/api/v1` path (proxied to the upstream API by
 * next.config.ts). Throws {@link ApiError} on non-2xx. On a 401 for an
 * authenticated request, clears the session and bounces to /login — there is no
 * refresh endpoint yet (see TODO below).
 */
export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, form, auth = true } = opts;

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
    // Only end the session when the token is actually gone/expired. This backend
    // is flaky (frequent 5xx), and a 401 on a still-valid token is usually a
    // transient hiccup — clearing + redirecting on those logged users out on
    // every background refetch. TODO(refresh): exchange the refresh token here
    // when POST /auth/refresh ships.
    if (isAccessTokenExpired()) {
      clearSession();
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
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
