## v1 — 2026-06-03 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Critical | `absolute bottom-4 left-1/2 -translate-x-1/2` baked in — impossible to reuse outside full-screen slide | Fixed v2 |
| 2 | Warning | `w-[362px]` fixed width — won't adapt if reused elsewhere | Fixed v2 — width moved to AuthSlide wrapper |
| 3 | Warning | `backdrop-blur-[5px]`, `rounded-[32px]`, `text-[28px]` — arbitrary values | Accepted — matches Figma spec, no token system |

## v2 — 2026-06-03 | refactor
Removed all positioning from AuthCard. Positioning (`absolute bottom-4 left-1/2 -translate-x-1/2 w-[362px]`) moved into AuthSlide as a layout wrapper around children.

### Status
Open: 0 | Fixed: 2 | Accepted: 1
