# ActivityButton — Audit

Component: `app/(main)/activity/_components/ActivityButton.tsx`

## v1 — 2026-06-17 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | `flex-1 min-w-0` on the root is a layout opinion (Rule 5.1). Inert outside a flex row so low-impact, but could move to a wrapper in ActivityCard. | Open |
| 2 | Suggestion | Filled variant lacks `hover:bg-primary-hover` (other CTAs have it). | Open |
| 3 | Suggestion | No `focus-visible:` ring. | Systemic — Confirmed ✓ |

Notes:
- Native `<button type="button">` ✓; `active:opacity-80` ✓; tone via a typed `Record` lookup. ✓
- Tokens clean: `rounded-card`, `bg-primary`, `border-primary`, `text-primary`, `text-xs`. ✓
- Spreads `ActivityAction` ({ label, variant }) — no className passthrough, consistent with the project's
  presentational components (no `cn()` in the project).

### Status
Open: 2 | Fixed: 0 | Accepted: 0

## v2 — 2026-06-17 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 2 | Suggestion | Filled variant lacked hover | Fixed v2 — `filled` → `hover:bg-primary-hover`, `outline` → `hover:bg-surface` |

Findings #1 (`flex-1` layout opinion — kept; intended row-fill behavior, inert standalone) and
#3 (focus-visible, systemic) remain open.

### Status
Open: 1 | Fixed: 1 | Accepted: 0 | Systemic: 1
