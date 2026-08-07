# RadioCardGroup — Audit

Light radio-card selection list (section header + subtitle → icon/title/description
cards with a radio indicator). `app/matches/create/_components/RadioCardGroup.tsx`.
Used by StepDetails for حالت بازی (3 modes) + نمایش مسابقه (private/public).

## v1 — 2026-08-05 | audit

Controlled composite (data-driven `options` + `value`/`onChange`), like its siblings
(RadioGroup/OptionSheet) — so Props-API primitive rules (native attrs, forwardRef, cn)
don't apply. Tokens used throughout (no hardcoded hex/px); icons via `currentColor`,
`aria-hidden` on the indicator + option icons; `active:opacity-90`; RTL correct (LTR
wrapper pins indicator-left / icon-right per the CLAUDE.md flex trap, `dir="rtl"` on
text). Global `:focus-visible` (globals.css:75) covers focus. `value = null` renders
nothing selected (safe).

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `role="radiogroup"` + `role="radio"` promised WAI-ARIA radio semantics (arrow-key nav + roving tabindex) that weren't implemented. | Fixed v2 — applied option (b): dropped the radio roles for `aria-pressed` toggle buttons + generic `role="group"` label. Matches app chip precedent; no unfulfilled ARIA contract. |
| 2 | Suggestion | Group is labeled with `aria-label={label}` while the same text is also a visible `<span>`; could `aria-labelledby` the visible header instead, and link the subtitle via `aria-describedby`. Minor. | Fixed v3 |
| 3 | Suggestion | No `className` passthrough / header comment — consistent with sibling step composites, so low priority. | Accepted |
| 4 | Accepted | `onChange: (id: string) => void` custom callback (not native `ChangeEventHandler`) | Accepted — matches project convention (RadioGroup / AuthSelect / all wizard steps) |

## v2 — 2026-08-05 | fix
Applied option (b) for finding #1: radio roles → `aria-pressed` toggle buttons.

## v3 — 2026-08-07 | fix
- **#2 Fixed** — `useId`-derived ids on the visible header/subtitle; the group now uses
  `aria-labelledby` + `aria-describedby` instead of a duplicated `aria-label`.
- **#3 Accepted** — no `className` passthrough. It's a feature composite used twice in one step,
  not a shared primitive; sibling step composites don't take one either. Add if it's ever reused
  outside the wizard.

### Status
Open: 0 | Fixed: 2 | Accepted: 2
