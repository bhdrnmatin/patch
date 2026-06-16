## v1 — 2026-06-08 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Good | Semantic `<header>` + `<h1>`; decorative images have `alt=""`; icon buttons via [[IconButton]] carry `aria-label`. | — |
| 2 | Warning · Systemic | Uses `<img>` not `next/image`. | Accepted — project-wide convention (ProfileHero, Avatar, StatCard all use `<img>`). |
| 3 | Token gap | `rounded-b-[24px]`, `drop-shadow-[…]`, gradient stops. | → TODO.md (matches ProfileHero convention). |

### Status
Open: 0 | Fixed: 0 | Accepted: 2

## v2 — 2026-06-16 | fix
Refactored to a thin wrapper over the new [[SportPageHeader]] (`title="مسابقه"`); the hero
implementation moved to `(main)/_components/SportPageHeader.tsx` so `/tournaments` can reuse it.
Public API and rendered output unchanged.

Regression check against v1: findings #1–3 still clean — they now live in SportPageHeader
(see SportPageHeader.audit.md) and remain accepted.

### Status
Open: 0 | Fixed: 0 | Accepted: 2
