/**
 * One match as an iCalendar file (RFC 5545) — what «اضافه به تقویم» hands the
 * phone. iOS opens a `text/calendar` response as an "Add to Calendar" sheet.
 * Android Chrome only downloads one, so `/calendar` sends Android to
 * `googleCalendarUrl` instead, which opens the Calendar app pre-filled.
 */
export interface CalendarEvent {
  id: string;
  title: string;
  location?: string;
  /** Epoch ms. */
  startMs: number;
  endMs: number;
  url?: string;
}

/** 20260928T143000Z — UTC, so the phone shows it in its own zone. */
const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** RFC 5545 §3.3.11: backslash, semicolon and comma are escaped; newlines become \n. */
const text = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export function buildIcs(e: CalendarEvent, now = Date.now()): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Patch//Match//FA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    // Stable per match, so adding it twice updates the event instead of duplicating it.
    `UID:${text(e.id)}@patchapp.ir`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(e.startMs)}`,
    `DTEND:${stamp(e.endMs)}`,
    `SUMMARY:${text(e.title)}`,
    ...(e.location ? [`LOCATION:${text(e.location)}`] : []),
    ...(e.url ? [`URL:${e.url}`] : []),
    // A reminder an hour before — the point of putting a match in a calendar.
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${text(e.title)}`,
    "TRIGGER:-PT1H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

/** The link the button opens: `/calendar` rebuilds the file from these. */
export function calendarHref(e: CalendarEvent): string {
  const q = new URLSearchParams({
    id: e.id,
    title: e.title,
    start: String(e.startMs),
    end: String(e.endMs),
    ...(e.location ? { location: e.location } : {}),
  });
  return `/calendar?${q}`;
}

/** Google Calendar's "new event" link — Android's add-to-calendar (see app/calendar/route.ts). */
export function googleCalendarUrl(e: CalendarEvent): string {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.startMs)}/${stamp(e.endMs)}`,
    ...(e.location ? { location: e.location } : {}),
    ...(e.url ? { details: e.url } : {}),
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}
