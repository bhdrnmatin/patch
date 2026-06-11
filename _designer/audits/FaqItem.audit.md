# FaqItem — Audit

## v1 — 2026-06-10 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `text-[#30445B]` hardcoded chevron color (Figma Gray/800, no token; closest `ink-soft` #253343 — not substituted per token-gap rule) | → TODO.md, TOKEN GAP comment added |
| 2 | Suggestion | Answer region not associated with trigger — add `useId` + `aria-controls` | Open |
| 3 | Suggestion | `rounded-[28px]` one-off radius (between `rounded-group` 24 and `rounded-card` 32) | Accepted — Figma exact, single use |

### Status
Open: 2 | Fixed: 0 | Accepted: 1

## v2 — 2026-06-11 | refactor
| # | Finding | Status |
|---|---------|--------|
| 2 | aria-controls association | Fixed v2 — `useId` + `aria-controls` (set only while open; no dangling ref) |

Regression check against v1: #1 (token gap) still open by design, #3 still accepted.

### Status
Open: 1 | Fixed: 1 | Accepted: 1
