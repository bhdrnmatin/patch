# ActivityCard — Audit

Component: `app/(main)/activity/_components/ActivityCard.tsx`
View-model: `ActivityItem` (`lib/types.ts`)

## v1 — 2026-06-17 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Card title rendered as plain `<span>`s, not a heading — a11y regression vs MatchCard/TournamentCard (`<h3>`). Wrap title parts in an `<h3>`. | Open |
| 2 | Suggestion | `rounded-3xl` (24px) instead of the semantic `rounded-group` token (also 24px); TournamentCard uses the token. | Open |
| 3 | Suggestion | Figma uses `rounded-24` (section A) vs `rounded-12` (court/match cards); unified to 24. Minor design deviation. | Open |
| 4 | Suggestion | Section labels + card titles are flat `<span>`s — heading semantics would help screen-reader navigation. | Systemic — same as MatchCard |
| 5 | Token gap | `text-[10px]` meta lines. | Accepted — DateCell precedent |
| 6 | Token gap | `border-divider` for the card border (Figma #E9EDF5). Blessed map says #E9EDF5→surface, too light for a border. | Accepted — nearest visible token |

Notes:
- `<article>` root, no fixed width/margin ✓. Takes a `{ item }` view-model — matches the card convention. ✓
- `faint` meta tone maps to `muted` per the blessed gray-ramp rule (documented in-file). ✓
- `shadow-card` token used for elevation (Figma 0 1px 2px/6% ≈ token). ✓
- RTL alignment handled correctly (LTR content block + `items-end`, `dir="rtl"` only on text) after the user-feedback fix.
- Card actions are placeholders (no onClick/navigation) — same status as the other list cards. → TODO.md.

### Status
Open: 4 | Fixed: 0 | Accepted: 2

## v2 — 2026-06-17 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Card title not a heading | Fixed v2 — title now an `<h3>` (parts as nested `<span>`s; styling moved to the h3) |
| 2 | Suggestion | `rounded-3xl` vs `rounded-group` token | Fixed v2 — uses `rounded-group` |

Findings #3 (radius 24 vs 12 design deviation), #4 (section-label heading semantics, systemic) remain open.
Verified: tsc + lint clean, card renders unchanged.

### Status
Open: 2 | Fixed: 2 | Accepted: 2
