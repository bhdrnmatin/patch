import { toPersianDigits } from "./persian";
// Inline jalali (Persian) <-> gregorian conversion — the canonical jalaali-js
// algorithm (public domain), ported to TS. Only what the date picker needs:
// conversion + month length. Self-check in lib/jalali.test.ts.

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
  2192, 2262, 2324, 2394, 2456, 3178,
];

const div = (a: number, b: number) => Math.trunc(a / b);
const mod = (a: number, b: number) => a - Math.trunc(a / b) * b;

function jalCal(jy: number): { leap: number; gy: number; march: number } {
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jm = 0;
  let jump = 0;
  for (let i = 1; i < BREAKS.length; i += 1) {
    jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): { jy: number; jm: number; jd: number } {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

export function toJalaali(gy: number, gm: number, gd: number) {
  return d2j(g2d(gy, gm, gd));
}
export function toGregorian(jy: number, jm: number, jd: number) {
  return d2g(j2d(jy, jm, jd));
}
export function isLeapJalaaliYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}
export function jalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
}

// ── Higher-level helpers for the date picker ────────────────────────────────

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];
/** Column order matches the RTL calendar header: شنبه … جمعه. */
export const JALALI_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const pad = (n: number) => String(n).padStart(2, "0");

/** ISO "YYYY-MM-DD" (Gregorian, local) — the storage format for a picked date. */
export function jalaliToISO(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return `${gy}-${pad(gm)}-${pad(gd)}`;
}
export function isoToJalali(iso: string) {
  const [gy, gm, gd] = iso.split("-").map(Number);
  return toJalaali(gy, gm, gd);
}
/** 0 = شنبه (Saturday) … 6 = جمعه (Friday), for grid column placement. */
export function jalaliWeekdayOfISO(iso: string): number {
  const [gy, gm, gd] = iso.split("-").map(Number);
  return (new Date(gy, gm - 1, gd).getDay() + 1) % 7; // getDay: 0=Sun…6=Sat
}
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function addDaysISO(iso: string, n: number): string {
  const [gy, gm, gd] = iso.split("-").map(Number);
  const d = new Date(gy, gm - 1, gd + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * "۱۴ مرداد" — jalali day + month name, in Persian digits.
 *
 * Accepts an ISO date or a full instant; only the date part is read. Three
 * places had byte-identical copies of this (the matches list mapping, the mock
 * createMatch, and the generated match title), which is two too many for a
 * one-line format string.
 */
export function jalaliDayMonth(iso: string): string {
  const { jm, jd } = isoToJalali(iso.slice(0, 10));
  return `${toPersianDigits(String(jd))} ${JALALI_MONTHS[jm - 1]}`;
}

/** Full weekday names, same column order as `JALALI_WEEKDAYS` (0 = شنبه). */
export const JALALI_WEEKDAY_NAMES = [
  "شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه",
];

/**
 * The date strip: `back` days before today through `forward` days after, each
 * carrying its ISO date as the id so a caller can compare it to a match date.
 * `past` is relative to today, which is what dims a cell.
 */
export function dayStrip(back: number, forward: number) {
  const today = todayISO();
  return Array.from({ length: back + forward + 1 }, (_, i) => {
    const iso = addDaysISO(today, i - back);
    return {
      id: iso,
      day: isoToJalali(iso).jd,
      weekday: JALALI_WEEKDAY_NAMES[jalaliWeekdayOfISO(iso)],
      past: i < back,
    };
  });
}

/**
 * The ISO date range a list filter's امروز / این هفته / این ماه covers, in the
 * Jalali calendar the user sees: the week ends on جمعه, and the month ends on
 * the real last day of the Jalali month (29, 30 or 31), not 30 days out.
 *
 * Both ends are inclusive and start at `from`, so a facet never reaches back
 * over matches that have already happened.
 */
export function dateFacetRange(
  facet: "today" | "week" | "month",
  from: string = todayISO(),
): { start: string; end: string } {
  if (facet === "today") return { start: from, end: from };
  if (facet === "week") {
    // 0 = شنبه … 6 = جمعه, so this many days are left in the week.
    return { start: from, end: addDaysISO(from, 6 - jalaliWeekdayOfISO(from)) };
  }
  const { jy, jm } = isoToJalali(from);
  return { start: from, end: jalaliToISO(jy, jm, jalaaliMonthLength(jy, jm)) };
}
