# SportPageHeader — Audit

Component: `app/(main)/_components/SportPageHeader.tsx`
Generalized hero (title prop) extracted from MatchesHeader; `MatchesHeader` is now a thin wrapper.

## v1 — 2026-06-16 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Inverted dependency: a shared `(main)/_components` layout imports leaves (`IconButton`, `DateSelector`, `icons`) from the feature folder `../matches/_components/`. Clean fix is to relocate the genuinely-shared leaves to `(main)/_components/` and have both features import from there. | Open — accepted pattern |
| 2 | Suggestion | Hero arbitrary values (`h-[276px]`, `w-[106.2%]`, `top-14`, `blur-[2px]`, `from-black/70`, `rounded-b-[24px]`, title `drop-shadow`) carried over verbatim from MatchesHeader. | Inherited — accepted (see MatchesHeader.audit.md) |

Notes:
- This is the extracted body of MatchesHeader (already audited 2026-06-08: 1 Warning, 2 accepted). Findings carry over as already-accepted.
- W1 is consistent with the established cross-folder reuse pattern (Match Details reused `IconButton` + matches icon set). Recorded as a known trade-off, not a blocker; a future shared-leaf relocation would resolve it for the whole `(main)` tree.
- `<img alt="">` decorative ✓; `<h1>` ✓; buttons carry aria-labels via IconButton ✓.

### Status
Open: 1 (accepted pattern) | Fixed: 0 | Accepted: 1

## v2 — 2026-06-16 | fix
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Inverted dependency (shared layer → matches feature) | Fixed v2 |

Relocated the shared leaves `icons`, `IconButton`, `DateCell`, `DateSelector` from
`(main)/matches/_components/` to the shared `(main)/_components/`. SportPageHeader now imports
only from its own shared dir. All importers repointed (matches, tournaments, and the match-details
`[id]` components, which now reach the shared layer instead of the matches feature). `PriceTag` +
the filter/sort sheets remain in matches (feature→feature reuse, not the inversion). Verified:
tsc clean, `/matches` + `/tournaments` + `/matches/[id]` all 200, header renders unchanged.

### Status
Open: 0 | Fixed: 1 | Accepted: 1

## v3 — 2026-06-17 | fix
Extended for the Activity page (3rd consumer): `days`/`selectedId`/`onSelect` made optional (hero
renders without the date strip when `days` is omitted); added optional `bgImage`/`athleteImage` props
defaulting to the matches scene. Backward-compatible — `/matches` + `/tournaments` pass the same props
and are visually unchanged. No new findings.

### Status
Open: 0 | Fixed: 1 | Accepted: 1

