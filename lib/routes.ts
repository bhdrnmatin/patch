// Single source of truth for cross-cutting app routes.

/** Where a signed-in user with a complete profile lands. */
export const POST_AUTH_ROUTE = "/matches";

/**
 * Where to send someone after they sign in.
 *
 * `next` is a URL from the query string, so it is only honoured when it is a
 * path on this app: a leading `/` and not `//`, which the browser reads as
 * another origin. Anything else falls back — an invite link must not become a
 * way to bounce a freshly-signed-in user off to someone else's site.
 */
export function postAuthRoute(next?: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : POST_AUTH_ROUTE;
}

/** The login URL that comes back to `here` once the session exists. */
export function loginRoute(here: string): string {
  return here === POST_AUTH_ROUTE ? "/login" : `/login?next=${encodeURIComponent(here)}`;
}

/** Carry a `next` onto an auth route while the user is still signing in. */
export function withNext(path: string, next?: string | null): string {
  return next ? `${path}${path.includes("?") ? "&" : "?"}next=${encodeURIComponent(next)}` : path;
}
