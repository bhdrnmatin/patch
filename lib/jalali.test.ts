// Runnable self-check for the inline jalali conversion. Run: npx tsx lib/jalali.test.ts
import assert from "node:assert/strict";
import {
  toJalaali,
  toGregorian,
  jalaaliMonthLength,
  isLeapJalaaliYear,
  jalaliToISO,
  jalaliWeekdayOfISO,
} from "./jalali";

// Nowruz anchors (jalali 1/1 ↔ gregorian).
assert.deepEqual(toGregorian(1400, 1, 1), { gy: 2021, gm: 3, gd: 21 });
assert.deepEqual(toJalaali(2021, 3, 21), { jy: 1400, jm: 1, jd: 1 });
assert.deepEqual(toGregorian(1399, 1, 1), { gy: 2020, gm: 3, gd: 20 });

// Today per the reference screenshot: 2026-08-05 == 14 مرداد 1405.
assert.deepEqual(toJalaali(2026, 8, 5), { jy: 1405, jm: 5, jd: 14 });

// Month lengths: first 6 = 31, next 5 = 30, esfand = 29 or 30 (leap).
assert.equal(jalaaliMonthLength(1400, 1), 31);
assert.equal(jalaaliMonthLength(1400, 7), 30);
assert.equal(isLeapJalaaliYear(1403), true); // 1403 is a leap year
assert.equal(jalaaliMonthLength(1403, 12), 30);
assert.equal(isLeapJalaaliYear(1404), false);
assert.equal(jalaaliMonthLength(1404, 12), 29);

// Round-trip a full year of jalali dates back and forth.
for (let jm = 1; jm <= 12; jm += 1) {
  const len = jalaaliMonthLength(1405, jm);
  for (let jd = 1; jd <= len; jd += 1) {
    const { gy, gm, gd } = toGregorian(1405, jm, jd);
    assert.deepEqual(toJalaali(gy, gm, gd), { jy: 1405, jm, jd });
  }
}

// Weekday: 2026-08-05 is a Wednesday → jalali column چ (index 4: ش=0…چ=4).
assert.equal(jalaliWeekdayOfISO("2026-08-05"), 4);
// ISO helper matches.
assert.equal(jalaliToISO(1405, 5, 14), "2026-08-05");

console.log("jalali self-check passed ✓");
