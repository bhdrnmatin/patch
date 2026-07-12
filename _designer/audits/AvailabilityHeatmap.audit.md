# AvailabilityHeatmap — Audit
`app/matches/create/_components/AvailabilityHeatmap.tsx` — the create-wizard centerpiece:
7 day-columns × 4 daypart-rows, 3 availability states, tap-to-pick-slot.

## v1 — 2026-07-12 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `role="grid"` without `role="row"`/`role="gridcell"` children is invalid ARIA — the row wrappers are `display: contents` divs with no role, and grid role implies arrow-key navigation that doesn't exist. Remove `role="grid"` (each cell button already has a full aria-label: day + daypart + state) | Open |
| 2 | Suggestion | Legend swatch color is derived via `CELL_TONE[state].split(" ")[0]` — fragile coupling to class-string order; use a separate swatch map | Open |
| 3 | Token gap | Cell width ≈36px (7 columns in a 318px card) is below the 44px touch rule; height is guarded by `min-h-11` | Accepted — physically constrained by 7 columns at 390px; matches wireframe geometry (40.75px boxes) |
| 4 | Note | `style={{gridTemplateColumns}}` with `days.length` — dynamic value, allowed exception to no-inline-styles | Accepted |
| 5 | Note | `dir="rtl"` on the grid container is safe — grid column *order* flips, no justify/items-end involved; legend row is LTR `justify-end` per the RTL rule | Clean |

Notes: state tones derive from tokens (`primary/15·45`, `edge/60`); blocked cells use native
`disabled`; selected cell `aria-pressed` + ring; past-day headers dimmed; all digits via
`toPersianDigits`; `text-[10px]` per StatusThumb precedent.

## v2 — 2026-07-12 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Invalid `role="grid"` | Fixed v2 — role removed (visual grid only; cells self-labeled), reason commented in code |
| 2 | Suggestion | Legend `split(" ")[0]` | Fixed v2 — dedicated `SWATCH_TONE` map |

Regression check against v1: cell states/tones, RTL order, disabled blocked cells unchanged.

### Status
Open: 0 | Fixed: 2 | Accepted: 2
