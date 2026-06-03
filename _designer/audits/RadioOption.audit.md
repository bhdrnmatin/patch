## v1 — 2026-06-03 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Critical | `<button>` with no `role="radio"` + `aria-checked` — announced as plain button by screen readers | Fixed v2 |
| 2 | Warning | No hover state | Fixed v2 |
| 3 | Warning | `text-[12px]` — arbitrary font size | Accepted — matches Figma spec |
| 4 | Warning | `min-h-[48px]` — arbitrary value (meets 44px touch target minimum) | Accepted — intentional |

## v2 — 2026-06-03 | refactor
Added `role="radio"` + `aria-checked={selected}`. Added `hover:bg-white/5` + `transition-colors`. Added `aria-hidden` on the visual radio circle span.

### Status
Open: 0 | Fixed: 2 | Accepted: 2
