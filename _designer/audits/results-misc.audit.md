# Results page (/matches/[id]/results) — misc audit

## v1 — 2026-07-11 | audit

Page-level notes for `app/matches/[id]/results/page.tsx` (components have their own files:
GameCard, PlayerSlotButton, ScoreStepper, PlayerPickerSheet).

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | Fixed-CTA clearance via a trailing `h-24` spacer div, while MatchDetailsPage does `pb-36` on `<main>` — two patterns for the same problem. Cosmetic; SubPageLayout owns the frame here so the spacer was the non-invasive option | Open |
| 2 | Note | Player identity = array index into `matchDetails.players` (type has no `id`). Fine for the mock era; must switch to real player ids when the API lands — flagged in TODO.md | Accepted for mock era |
| 3 | Note | "ثبت نهایی نتایج" CTA is cosmetic (no submit), same as all other page CTAs — behavior wiring logged in TODO.md | Accepted (post-mock wiring) |
| 4 | Note | Reuses profile's `SubPageLayout` — feature→feature import, consistent with the accepted PriceTag / Filter-SortSheet precedent; promote to shared `(main)/_components` only if a third consumer appears | Accepted — precedent |

Notes: immutable state updates throughout ✓; picker excludes players already placed in the game
while keeping the current occupant selectable (tap-to-clear) ✓; complete-game caption derives
from state ✓; `Suspense` boundary wraps `useSuspenseQuery` per the details-page pattern ✓.

### Status
Open: 1 | Fixed: 0 | Accepted: 3
