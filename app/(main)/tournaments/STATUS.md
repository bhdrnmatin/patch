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
- [R] `IconButton`, `DateCell`, `DateSelector`, `PriceTag` — matches/_components
- [R] `BottomSheet`, `FilterSection`, `SelectChip` — matches/_components
- [R] `FilterSheet`, `SortSheet` — matches/_components (match facets; revisit if tournament-specific facets needed)
- [R] `BottomNav` — (main)/_components (global in layout)
- [R] icons: `FilterSearchIcon`, `SortIcon`, `TomanIcon` — matches/_components/icons
- [R] `public/images/matches-header-athlete.webp` + `matches-header-bg.webp` — hero image

## Assets
- [x] `public/images/tournament-poster.webp` — card poster (740px, q80)
