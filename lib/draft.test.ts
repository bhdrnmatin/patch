// Run: npx tsx lib/draft.test.ts
import assert from "node:assert/strict";
import type { CreateMatchDraft } from "./types";
// Static import is safe: draft.ts only touches localStorage inside its
// functions, so the stub below just has to exist before the first call.
import { readDraft, writeDraft, clearDraft } from "./draft";

// Minimal localStorage, installed before the module under test reads it.
const store = new Map<string, string>();
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};

const KEY = "patch:create-match-draft";
const base = { title: "بازی جمعه" } as CreateMatchDraft;
const day = (offset: number) =>
  new Date(Date.now() + offset * 86_400_000).toLocaleDateString("en-CA");

// Round-trips, keeping the step the user left on.
writeDraft({ draft: base, step: 2, maxStep: 3 });
assert.deepEqual(readDraft(), { draft: base, step: 2, maxStep: 3 });

// A draft for today is still usable — the match hasn't happened yet.
writeDraft({ draft: { ...base, date: day(0) }, step: 2, maxStep: 2 });
assert.equal(readDraft()?.draft.date, day(0));

// A draft whose day has passed is dropped, and dropped from storage too, so it
// can't be offered again on the next visit.
writeDraft({ draft: { ...base, date: day(-1) }, step: 2, maxStep: 2 });
assert.equal(readDraft(), null);
assert.equal(store.has(KEY), false);

// Tomorrow survives.
writeDraft({ draft: { ...base, date: day(1) }, step: 1, maxStep: 1 });
assert.equal(readDraft()?.draft.date, day(1));

// Garbage in storage reads as "no draft" rather than throwing into the wizard.
store.set(KEY, "{not json");
assert.equal(readDraft(), null);
store.set(KEY, JSON.stringify({ step: 0 })); // no draft key
assert.equal(readDraft(), null);

// Nothing saved, and after a clear.
store.clear();
assert.equal(readDraft(), null);
writeDraft({ draft: base, step: 0, maxStep: 0 });
clearDraft();
assert.equal(readDraft(), null);

console.log("draft.test.ts: all passed");
