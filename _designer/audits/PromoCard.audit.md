# PromoCard — Audit

## v1 — 2026-06-10 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `mt-[17px]` margin on root (Rule 5.1 — consumer should own external spacing; compensates image top-overflow) | Open — wrap overflow inside a 127px-tall container instead |
| 2 | Suggestion | Promo copy hardcoded inside component | Accepted — single-use promo |
| 3 | Note | Image geometry arbitraries (`w-[91px]` etc.) | Accepted — Figma structural |

### Status
Open: 1 | Fixed: 0 | Accepted: 2

## v2 — 2026-06-11 | refactor
| # | Finding | Status |
|---|---------|--------|
| 1 | `mt-[17px]` margin on root | Fixed v2 — root is now a margin-free 127px-tall wrapper (`pt-[17px]`, Figma frame height); card + image unchanged inside |

### Status
Open: 0 | Fixed: 1 | Accepted: 2
