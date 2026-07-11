# PlayerPickerSheet — Audit

## v1 — 2026-07-11 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Selected row conveys state only visually (border-primary + check icon). Add `aria-pressed={isSelected}` to the row button so screen readers hear the toggle state (tapping the selected player clears the slot) | Open |
| 2 | Note | Rows keyed by array index — `MatchPlayer` has no `id` field; fine for the static mock list, revisit when the API adds player ids (also noted in results-misc) | Accepted for mock era |

Notes: inherits audited BottomSheet (dialog role, aria-modal, Escape, scroll lock, back-button
handling) ✓; native `disabled` + `disabled:opacity-40` on used players ✓; `<ul>/<li>` list
semantics ✓; CheckIcon is `aria-hidden` via the shared icon set ✓; template-ternary className
matches project convention (no clsx installed — accepted deviation).

## v2 — 2026-07-11 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Selected state visual-only | Fixed v2 — `aria-pressed={isSelected}` on row buttons |

Regression check against v1: BottomSheet inheritance, native disabled, ul/li still clean.

### Status
Open: 0 | Fixed: 1 | Accepted: 1
