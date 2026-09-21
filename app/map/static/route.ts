import type { NextRequest } from "next/server";

// Neshan's static-map key. An <img> can't send the Api-Key header and a key= in
// the src would ship it to every client, so this route attaches it server-side.
// Unset → Neshan answers JSON, not an image → CourtMap hides the map and keeps
// the مسیریابی link, which needs no key.
const NESHAN_API_KEY = process.env.NESHAN_API_KEY ?? "";

const UPSTREAM = "https://api.neshan.org/v5/static";

/** A day. The URL carries the club's own latitude/longitude, which don't move —
 *  a club that relocates gets a different URL, not a stale picture. */
const MAX_AGE = 86400;

/**
 * Static-map proxy.
 *
 * This was a `rewrites()` entry until 2026-09-21. Neshan sends **no**
 * `Cache-Control`, no `ETag` and no `Last-Modified` on `/v5/static` (probed),
 * so a 110KB PNG isn't even heuristically cacheable and every return to a club
 * refetched an identical image. A `headers()` rule can't fix that: Next skips
 * `headers()` entirely for an **external** rewrite and passes the upstream
 * response through untouched (verified — the same rule lands on a normal route
 * and never on this one). A route handler owns its own response, so the header
 * is ours to set.
 *
 * The caller supplies latitude/longitude/zoom/width/height/style/marker; only
 * the key is added here.
 */
export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  params.set("key", NESHAN_API_KEY);

  const upstream = await fetch(`${UPSTREAM}?${params}`, {
    // Cache on the server too, so one club's map is fetched from Neshan once
    // for every visitor rather than once per visitor.
    next: { revalidate: MAX_AGE },
  });

  // Pass the failure through rather than dressing it up: a non-image body makes
  // the <img> fire onError, which is exactly how CourtMap decides to hide it.
  // Never cached — a missing key or a spent quota is a state that gets fixed.
  if (!upstream.ok) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/png",
      "Cache-Control": `public, max-age=${MAX_AGE}`,
    },
  });
}
