import type { CreateMatchDraft } from "./types";

/**
 * The half-finished create-match wizard, kept in localStorage.
 *
 * There is no draft concept on the API (`_designer/api-findings.md`), so this is
 * per-device: a draft started on a phone won't follow the user to another one.
 *
 * Exactly one draft is stored. More than one would need a list to choose from,
 * which is a screen the app doesn't have — and the wizard is a single flow that
 * a person is realistically part-way through once.
 */

const KEY = "patch:create-match-draft";

export interface SavedDraft {
  draft: CreateMatchDraft;
  /** The step being edited when the user left. */
  step: number;
  /** Furthest step reached, so the chip strip stays as they left it. */
  maxStep: number;
}

/** Today as "YYYY-MM-DD" — the draft's own date format, so a string compare works. */
function today(): string {
  return new Date().toLocaleDateString("en-CA");
}

/**
 * The saved draft, or null when there isn't a usable one. Drops a draft whose
 * day has already passed rather than resuming someone into a match they can no
 * longer create.
 */
export function readDraft(): SavedDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedDraft;
    if (!saved?.draft) return null;
    if (saved.draft.date && saved.draft.date < today()) {
      clearDraft();
      return null;
    }
    return saved;
  } catch {
    // Malformed JSON, or storage unavailable (Safari private mode throws on
    // read). Either way there is no draft to offer.
    return null;
  }
}

export function writeDraft(saved: SavedDraft): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    // Quota or private mode — losing the draft is survivable, crashing isn't.
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // As above.
  }
}
