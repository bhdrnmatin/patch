import assert from "node:assert/strict";
import { buildIcs } from "./calendar";

const ics = buildIcs(
  { id: "m1", title: "دوبل, عصر; ۱", location: "باشگاه\nآزادی", startMs: Date.UTC(2026, 8, 28, 14, 30), endMs: Date.UTC(2026, 8, 28, 16, 30), url: "https://patchapp.ir/matches/m1" },
  Date.UTC(2026, 8, 27, 10, 0),
);
const lines = ics.split("\r\n");
assert.ok(lines.includes("DTSTART:20260928T143000Z"));
assert.ok(lines.includes("DTEND:20260928T163000Z"));
assert.ok(lines.includes("DTSTAMP:20260927T100000Z"));
assert.ok(lines.includes("SUMMARY:دوبل\\, عصر\; ۱"), "commas and semicolons escaped");
assert.ok(lines.includes("LOCATION:باشگاه\\nآزادی"), "newline escaped, not a raw line break");
assert.ok(lines.includes("UID:m1@patchapp.ir"));
assert.equal(lines[0], "BEGIN:VCALENDAR");
assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
console.log("calendar: ok");
