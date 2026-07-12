## v1 — 2026-06-08 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Good | Native `<button>`, `aria-pressed={selected}`, keyboard-operable. | — |
| 2 | Suggestion | Date strip is single-select; radio semantics (`role="radio"`/`radiogroup`) would be more precise than `aria-pressed`. | Accepted — toggle semantics are acceptable for a day filter. |
| 3 | Token gap | `text-[#253343]` — no token. | → TODO.md (systemic gray gap). |

### Status
Open: 0 | Fixed: 0 | Accepted: 1

## v2 — 2026-07-12 | fix
Added optional `tone?: "glass" | "light"` (default glass — existing headers pixel-identical).
Light variant for bg-surface pages: selected `bg-primary text-white`, past `bg-surface text-muted`,
default `bg-white border-edge` — fixes invisible selected state outside hero imagery (flagged risk
in the create-wizard plan; first consumer: /matches/create step ۳).

Regression check against v1: aria-pressed, native button, tokens still clean; glass tones untouched.

### Status
Open: 0 | Fixed: 0 | Accepted: 1
