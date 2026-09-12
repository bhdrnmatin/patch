#!/usr/bin/env node
/**
 * Drives the OTP screen in WebKit and asserts the input mechanics.
 *
 * This is NOT a Safari test. Playwright ships its own WebKit build, so it shares
 * the engine with Safari but none of the browser chrome — the toolbar, the
 * visualViewport keyboard and env(safe-area-inset-*) are all absent. What it
 * does catch is the half of the OTP flow that is plain JS: focus stepping,
 * the Persian-digit filter, paste, and the single-event SMS autofill spread.
 * Anything about the keyboard or the toolbar still needs a real device.
 *
 * Deps are installed --no-save (same as puppeteer-core) so package.json stays
 * a product manifest:
 *   npm i --no-save playwright && npx playwright install webkit
 *   sudo npx playwright install-deps webkit
 *
 * Run (dev server must already be up):  node scripts/otp-webkit.mjs
 */
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";

let webkit, devices;
try {
  ({ webkit, devices } = await import("playwright"));
} catch {
  console.error("playwright is missing. Run:\n  npm i --no-save playwright && npx playwright install webkit");
  process.exit(2);
}

const BASE = process.env.BASE ?? "http://localhost:3000";
const PHONE = "09123456789";
const FA = "۰۱۲۳۴۵۶۷۸۹";
const fa = (s) => String(s).replace(/\d/g, (d) => FA[+d]);

/** The five real inputs sit on top of the OtpBoxes that draw the digits. */
const BOXES = 'input[autocomplete="one-time-code"]';

const results = [];
const consoleErrors = [];

async function main() {
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();

  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

  // A minute of runway so the resend countdown renders rather than the button.
  const expires = new Date(Date.now() + 60_000).toISOString();
  const url = `${BASE}/otp?phone=${PHONE}&expires=${encodeURIComponent(expires)}`;

  const reset = async () => {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector(BOXES);
  };

  /** Joined value of the five boxes, e.g. "۱۲۳۴۵". */
  const code = () => page.$$eval(BOXES, (els) => els.map((e) => e.value).join(""));
  /** What the user actually sees — the OtpBox spans behind the transparent inputs. */
  const painted = () =>
    page.$$eval('[aria-hidden="true"] > span', (els) => els.map((e) => e.textContent).join(""));
  const focusedIndex = () =>
    page.$$eval(BOXES, (els) => els.findIndex((e) => e === document.activeElement));
  const submit = () => page.getByRole("button", { name: "تایید" });

  /** Sets a value the way SMS autofill does: one input event carrying every digit. */
  const autofill = (value) =>
    page.$eval(
      BOXES,
      (el, v) => {
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        set.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      },
      value,
    );

  const paste = (text) =>
    page.$eval(
      BOXES,
      (el, t) => {
        const dt = new DataTransfer();
        dt.setData("text/plain", t);
        el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
      },
      text,
    );

  async function check(name, fn) {
    try {
      await reset();
      await fn();
      results.push({ name, ok: true });
    } catch (err) {
      const shot = path.join(os.tmpdir(), `otp-webkit-${name.replace(/\W+/g, "-")}.png`);
      await page.screenshot({ path: shot }).catch(() => {});
      results.push({ name, ok: false, err: err.message, shot });
    }
  }

  await check("renders five boxes with the SMS-autofill hints", async () => {
    assert.equal(await page.locator(BOXES).count(), 5, "expected 5 one-time-code inputs");
    const modes = await page.$$eval(BOXES, (els) => els.map((e) => e.inputMode));
    assert.ok(modes.every((m) => m === "numeric"), `inputMode should be numeric, got ${modes}`);
  });

  await check("typing fills boxes in Persian and steps focus", async () => {
    await page.locator(BOXES).first().click();
    await page.keyboard.type("12345");
    assert.equal(await code(), fa("12345"), "input values");
    assert.equal(await painted(), fa("12345"), "digits painted by OtpBox");
  });

  await check("Latin digits are never shown", async () => {
    await page.locator(BOXES).first().click();
    await page.keyboard.type("12345");
    assert.doesNotMatch(await painted(), /[0-9]/, "a Latin digit reached the UI");
  });

  await check("non-digits are rejected", async () => {
    await page.locator(BOXES).first().click();
    await page.keyboard.type("a1b2");
    assert.equal(await code(), fa("12"), "letters should be filtered out");
  });

  await check("submit is disabled until all five are in", async () => {
    assert.ok(await submit().isDisabled(), "should start disabled");
    await page.locator(BOXES).first().click();
    await page.keyboard.type("1234");
    assert.ok(await submit().isDisabled(), "still disabled at four digits");
    await page.keyboard.type("5");
    assert.ok(await submit().isEnabled(), "should enable at five digits");
  });

  await check("backspace clears a digit and leaves the caret on the empty box", async () => {
    await page.locator(BOXES).first().click();
    await page.keyboard.type("12345");
    await page.keyboard.press("Backspace");
    assert.equal(await code(), fa("1234"), "last digit should be gone");
    // Box ۴, not ۳. This asserted 3 until 2026-09-12, which was the bug: index 3
    // still holds the ۴, so the next digit typed replaced it instead of filling
    // the gap. The caret belongs on the first empty box after any deletion.
    assert.equal(await focusedIndex(), 4, "caret should sit on the box just emptied");
  });

  await check("erase then type refills the gap instead of overwriting", async () => {
    await page.locator(BOXES).first().click();
    await page.keyboard.type("12345");
    await page.keyboard.press("Backspace");
    await page.keyboard.type("6");
    // The reported bug: ۱۲۳۴_ became ۱۲۳۵_ because the caret had stepped back
    // onto the filled box.
    assert.equal(await code(), fa("12346"), "the typed digit should fill the empty box");
    assert.equal(await painted(), fa("12346"), "and the boxes should paint it");
  });

  await check("paste fills every box from one event", async () => {
    await paste("54321");
    assert.equal(await code(), fa("54321"), "paste should spread across the boxes");
  });

  await check("paste strips separators and over-long codes", async () => {
    await paste("9-8 7.6/5 4");
    assert.equal(await code(), fa("98765"), "should keep the first five digits only");
  });

  await check("SMS autofill spreads a single-field code across the boxes", async () => {
    await autofill("13579");
    assert.equal(await code(), fa("13579"), "one input event carrying five digits");
  });

  await check("a cleared box actually clears", async () => {
    await page.locator(BOXES).first().click();
    await page.keyboard.type("12345");
    // Select-all inside a box and delete — the path a real user takes when the
    // caret is not at the end, and the one handleChange used to bail on.
    // ControlOrMeta, not Meta: the WebKit build runs on the host OS, so the
    // select-all accelerator here is Ctrl even under an iPhone device profile.
    await page.locator(BOXES).nth(2).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Delete");
    // Compacts, exactly as Backspace does — the two deletion paths agree.
    assert.equal(await code(), fa("1245"), "the third digit should be gone");
  });

  await check("retyping a filled box replaces one digit, not the whole code", async () => {
    await page.locator(BOXES).first().click();
    await page.keyboard.type("12345");
    // Focus is still in the last box and the caret sits after its digit, so the
    // field hands handleChange two characters. That is NOT autofill arriving:
    // the multi-character branch used to read it as one and replace the whole
    // value with those two digits, restarting the code at box ۱.
    await page.keyboard.type("6");
    assert.equal(await code(), fa("12346"), "only the last digit should change");
    assert.equal(await painted(), fa("12346"), "and the boxes should paint it");
  });

  await browser.close();
}

await main();

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  if (!r.ok) console.log(`      ${r.err}\n      shot: ${r.shot}`);
}
if (consoleErrors.length) {
  console.log(`\n${consoleErrors.length} console/page error(s):`);
  for (const e of new Set(consoleErrors)) console.log(`  ${e}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length || consoleErrors.length ? 1 : 0);
