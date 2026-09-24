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

## v4 — 2026-09-24 | audit (remove-player mutation, shipped 2026-09-22)
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 3 | Warning | **A failed removal is silent.** `useMutation` has no `onError` and nothing reads `isError`, so on a 4xx/5xx the chip un-dims and nothing else happens. The organizer can't tell "didn't work" from "hasn't refreshed yet". Fix: a `role="alert"` line under the grid, the same as `ShareCard`'s revoke failure. | Open |
| 4 | Warning | **The ✕ shows on live and finished matches.** `canRemove` is `role === "creator" && !cancelled`, so the organizer can remove a player from a match that has already been played. Not verified whether the server refuses it. Either way, the UI shouldn't offer it after `upcoming`. Fix: pass `canRemove={role === "creator" && status === "upcoming"}` from the page. | Open — verify server behaviour |
| 5 | Suggestion | While one removal is pending, the other chips' ✕ stay live. A second tap replaces `variables`, so the first chip loses its busy state mid-request. Disable every ✕ while `isPending`. | Open |

Regression check against v3: #1 (list semantics) still clean.

### Status
Open: 3 | Fixed: 2 | Accepted: 0

## v5 — 2026-09-24 | fix
#3 Fixed v5 — a failed removal shows «حذف بازیکن انجام نشد. دوباره تلاش کن.» (`role="alert"`) under the grid.
#4 Fixed v5 — the page passes `canRemove` only when `role === "creator" && status === "upcoming"` (one `canRemove` const in `page.tsx`, used by both grid placements). Server behaviour on live/finished still unverified, but the UI no longer asks.

### Status
Open: 1 | Fixed: 4 | Accepted: 0

## v6 — 2026-09-24 | fix
#5 Fixed v6 — every chip gets `locked={isPending}`, so only one removal runs at a time.

### Status
Open: 0 | Fixed: 5 | Accepted: 0
