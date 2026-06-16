# TournamentCard — Audit

Component: `app/(main)/tournaments/_components/TournamentCard.tsx`
View-model: `TournamentListItem` (`lib/types.ts`)

## v1 — 2026-06-16 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | CTA "جزئیات تورنومنت" is a `<button>` with no `onClick`/navigation — should be a `<Link href="/tournaments/{id}">` once the detail route exists. Mirrors MatchCard's open CTA item. | Open → TODO.md |
| 2 | Suggestion | `backdrop-blur-[4px]` on the CTA (line 38) is a no-op: solid `bg-primary` inside an opaque card, nothing behind to blur. Drop it. | Open |
| 3 | Suggestion | Heading order — `<h3>` with no `<h2>` on the page (page has only `<h1>`). Same systemic note as MatchCard. | Open |
| 4 | Suggestion | No `focus-visible:` ring on the CTA. | Systemic — Confirmed ✓ |
| 5 | Token gap | `border-[1.5px]` — accepted one-off (FilterSheet footer precedent). | Accepted |

Notes:
- Takes a `{ tournament }` view-model object — matches the MatchCard convention. ✓
- Reuses `PriceTag` (currentColor glyph), `TournamentPoster`, `InfoPair`. No duplicated UI. ✓
- Tokens otherwise clean: `rounded-group`, `rounded-pill`, `bg-surface`, `bg-white`, `border-edge`, `text-ink-soft`, `bg-primary`, `hover:bg-primary-hover`. ✓
- `price` helper recreated per render — negligible (Rule 5.5), accepted.

### Status
Open: 3 | Fixed: 0 | Accepted: 2

## v2 — 2026-06-16 | fix
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 2 | Suggestion | `backdrop-blur-[4px]` no-op on the CTA | Fixed v2 — removed (no behind-content to blur on an opaque card) |

Findings #1 (CTA navigation — needs `/tournaments/[id]`), #3 (heading order), #4 (focus-visible, systemic)
remain open/accepted as before.

### Status
Open: 2 | Fixed: 1 | Accepted: 2
