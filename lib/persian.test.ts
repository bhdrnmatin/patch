// Runnable self-check for the shared mobile rule. Run: npx tsx lib/persian.test.ts
import assert from "node:assert/strict";
import { isValidMobile, toLatinDigits, toPersianDigits } from "./persian";

// Both notations, since /login stores Persian digits and the sheet stores Latin.
assert.equal(isValidMobile("۰۹۱۲۳۴۵۶۷۸۹"), true);
assert.equal(isValidMobile("09123456789"), true);
assert.equal(isValidMobile("۰۹۱۲۳۴۵۶۷۸"), false); // 10 digits
assert.equal(isValidMobile("۰۹۱۲۳۴۵۶۷۸۹۰"), false); // 12 digits
assert.equal(isValidMobile("۰۸۱۲۳۴۵۶۷۸۹"), false); // not 09
assert.equal(isValidMobile("+۹۸۹۱۲۳۴۵۶۷۸۹"), false); // no country-code form
assert.equal(isValidMobile(""), false);

assert.equal(toLatinDigits(toPersianDigits("09123456789")), "09123456789");

console.log("persian: ok");
