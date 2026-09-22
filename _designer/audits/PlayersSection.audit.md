# PlayersSection — Audit

## v1 — 2026-06-10 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | Player grid could use `<ul>/<li>` list semantics (same open suggestion as MatchCard) | Open |
| 2 | Suggestion | "همه" button has no destination yet | Open — logged in session-state |

### Status
Open: 2 | Fixed: 0 | Accepted: 0

## v2 — 2026-06-11 | refactor
| # | Finding | Status |
|---|---------|--------|
| 1 | Player grid list semantics | Fixed v2 — `<ul>`/`<li>` |

### Status
Open: 1 | Fixed: 1 | Accepted: 0

## v3 — 2026-09-22 | fix (API reality)
#2 Closed v3 — «همه» is **deleted**. It had no `onClick`, there is no roster page to open, and a
four-player grid already shows everyone.
New in v3, not yet audited: the organizer's ✕ on each chip
(`DELETE /matches/{id}/participants/{participantId}`), 44px hit area, never on their own chip.

### Status
Open: 0 | Fixed: 2 | Accepted: 0
