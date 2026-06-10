## v1 — 2026-06-08 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Good | Semantic `<header>` + `<h1>`; decorative images have `alt=""`; icon buttons via [[IconButton]] carry `aria-label`. | — |
| 2 | Warning · Systemic | Uses `<img>` not `next/image`. | Accepted — project-wide convention (ProfileHero, Avatar, StatCard all use `<img>`). |
| 3 | Token gap | `rounded-b-[24px]`, `drop-shadow-[…]`, gradient stops. | → TODO.md (matches ProfileHero convention). |

### Status
Open: 0 | Fixed: 0 | Accepted: 2
