import type { NextRequest } from "next/server";
import { buildIcs, googleCalendarUrl } from "@/lib/calendar";

/**
 * «اضافه به تقویم»: answers a match as a `.ics` file.
 *
 * A route rather than a Blob built in the page, because a Blob download does
 * nothing useful in an installed iOS PWA, while a plain link to a
 * `text/calendar` response opens the system "Add to Calendar" sheet there and
 * in Safari. Android is redirected to Google Calendar (below). The match itself can't
 * be fetched here (the API wants the user's bearer, which lives in the
 * browser), so the page puts what the event needs in the query.
 */
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const start = Number(q.get("start"));
  const end = Number(q.get("end"));
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return new Response("bad request", { status: 400 });
  }
  const clip = (s: string | null) => (s ?? "").slice(0, 200);
  const id = clip(q.get("id")) || "match";

  const event = {
    id,
    title: clip(q.get("title")) || "مَچ پچ",
    location: clip(q.get("location")) || undefined,
    startMs: start,
    endMs: end,
    url: `${request.nextUrl.origin}/matches/${encodeURIComponent(id)}`,
  };

  // Android Chrome downloads a .ics instead of opening it, so Android gets
  // Google Calendar's pre-filled event link (the app opens it) instead.
  if (/Android/i.test(request.headers.get("user-agent") ?? "")) {
    return Response.redirect(googleCalendarUrl(event), 302);
  }

  return new Response(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="patch-match.ics"',
      "Cache-Control": "no-store",
    },
  });
}
