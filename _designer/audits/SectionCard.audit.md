# SectionCard — Audit

## v1 — 2026-06-10 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | Header `InfoIcon` renders at its 20px default; Figma shows 24px in the 32px circle — pass `className="size-6"` | Open |
| 2 | Systemic | Shadow `0px_2px_1.5px_rgba(0,0,0,0.05)` is one of 4 recurring elevation values (12+ uses) — prior "accepted as one-offs" decision is stale | → TODO.md (reopened) |

### Status
Open: 2 | Fixed: 0 | Accepted: 0

## v2 — 2026-06-11 | refactor
| # | Finding | Status |
|---|---------|--------|
| 1 | Header InfoIcon 20px vs Figma 24px | Fixed v2 — `className="size-6"` |

Regression check against v1: #2 (elevation tokens) still open in TODO.md.

### Status
Open: 1 | Fixed: 1 | Accepted: 0
