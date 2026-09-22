# Tournaments — Build Status

Figma: `node-id=20176-13411` (تورنمنت list page)

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[R]` reused (no work)

## Data
- [x] `TournamentListItem` type — `lib/types.ts`
- [x] `tournamentList` mock — `lib/mock/index.ts`
- [R] `matchDays` mock — reused for the date strip

## Base components (`tournaments/_components/`)
- [x] `InfoPair` — RTL `label:`(muted) + `value`(bold) pair
- [x] `PosterBadge` — dark-glass status pill over the poster

## Compound components (`tournaments/_components/`)
- [x] `TournamentPoster` — framed poster + `PosterBadge`
- [x] `TournamentCard` — poster + title + info grid + CTA

## Layout (`(main)/_components/`)
- [x] `SportPageHeader` — generalized hero (title prop), reuses `IconButton` + `DateSelector`
- [x] `MatchesHeader` — refactor to thin wrapper over `SportPageHeader`

## Page
- [x] `tournaments/page.tsx` — header + card list + filter/sort sheets

## Reused as-is (do NOT recreate)
- [R] `IconButton`, `DateCell`, `DateSelector`, `icons` — **(main)/_components** (shared layer)
- [R] `PriceTag` — matches/_components (feature-shared)
- [R] `BottomSheet`, `FilterSection`, `SelectChip` — matches/_components
- [R] `FilterSheet`, `SortSheet` — matches/_components (match facets; revisit if tournament-specific facets needed)
- [R] `BottomNav` — (main)/_components (global in layout)
- [x] `public/images/tournaments-header.webp` — baked hero (podium/trophy scene blurred+tinted +
      sharp medalist cutout composited on top, Figma geometry); passed as `athleteImage`.
      (Was wrongly reusing the matches action scene — fixed 2026-06-17.)

## Assets
- [x] `public/images/tournament-poster.webp` — card poster (740px, q80)
