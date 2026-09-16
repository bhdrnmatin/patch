## v1 — 2026-06-03 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Empty spacer div has no comment — purpose unclear | Fixed v2 — added comment |
| 2 | Warning | `relative w-full h-full` — requires sized parent | Accepted — intentional, always used inside a fixed-size frame |
| 3 | Suggestion | `backgroundImage` prop accepts Figma CDN URLs that expire in 7 days | Accepted — noted in STATUS.md, production concern |

## v2 — 2026-06-03 | refactor
Added comment to status bar spacer. AuthSlide now owns the card positioning wrapper (`absolute bottom-4 left-1/2 -translate-x-1/2 w-[362px]`) — moved from AuthCard.

## v-next — 2026-09-16 | change review
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| n1 | Note | `pinTop` — top-anchored, full-width art with a `mask-image` fade into a fixed `bg-night` layer, for photos with baked-in text that `object-cover` would crop. Checked on iPhone 13 and SE widths; the page canvas follows via `body:has(.bg-night)` in globals.css (Android nav bar) | Clean |

### Status
Open: 0 | Fixed: 1 | Accepted: 2
