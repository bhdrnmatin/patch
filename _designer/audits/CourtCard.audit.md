# CourtCard — Audit

## v1 — 2026-06-10 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `text-[32px] leading-[56px]` display heading — no type token above `text-title` (28px) | → TODO.md, TOKEN GAP comment added |
| 2 | Warning | Token substitutions: Figma `#E9EDF5` (edit-btn bg) → `bg-surface`, `#92A7C1` (label) → `text-muted` — guessed nearest token against token-gap rule | Open — human decision (bless or add ramp tokens), see TODO.md |
| 3 | Suggestion | Edit + مسیریابی buttons are cosmetic (no handlers) | Open — logged in session-state |

### Status
Open: 3 | Fixed: 0 | Accepted: 0

## v2 — 2026-06-11 | fix (token decisions)
#1 Fixed v2 — `text-display` token added (32px/56px), heading swept.
#2 Fixed v2 — gray-ramp mapping blessed (documented in CLAUDE.md); substitutions are now the rule.

### Status
Open: 1 | Fixed: 2 | Accepted: 0

## v3 — 2026-09-22 | fix (API reality)
#3 Closed v3 — مسیریابی became a real link when `CourtMap` landed (2026-09-12); the **edit button
is deleted**. It was never going to get a handler: the API has no update-match endpoint at all
(no PUT, no PATCH — checked against the live spec). The `#E9EDF5` substitution in #2 went with it.
New in v3, not yet audited: the club **logo** and a **tap-to-call** row, both from `ClubResponse`
fields the app had declared and never rendered.

### Status
Open: 0 | Fixed: 3 | Accepted: 0
