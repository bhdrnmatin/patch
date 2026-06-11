# TODO

## Token gaps — Matches audit (2026-06-08)

The Matches components use recurring hardcoded grays with no token (consistent
with existing components like StatCard/ProfileMeta, which hardcode the same hexes).
Decide: add semantic tokens to `app/globals.css` `@theme`, adjust the design, or accept.

- [x] Token gap (gray scale) — **done 2026-06-10**: added `--color-ink` (#00254D),
      `--color-ink-soft` (#253343), `--color-muted` (#6783A0), `--color-surface` (#F5F7FA),
      `--color-divider` (#E5EAF0), `--color-edge` (#D0DDEC, borders + avatar bg) to `@theme`;
      all hardcoded usages across Matches/profile/nav replaced with token classes.
- [x] Token gap (StatusBadge) — **accepted as one-off**: held green pair `#E8F5E9`/`#2E7D32`
      used in exactly one component; promote to status tokens only if a second consumer appears.
      (Not-held state now uses `bg-surface text-muted`.)
- [x] Token gap (radii) — **accepted as one-offs**: sheet 40px / close 20px / header 24px
      each occur once; `BottomSheet` is shared so the sheet radius lives in one file anyway.
- [x] Token gap (shadows) — **accepted for now**: three distinct shadows in three places;
      revisit an elevation scale only when more layers exist.

## Matches — behavior wiring (post-mock)
- [ ] Wire SortSheet selections to actually sort `matchList`.
- [ ] Wire FilterSheet selections to actually filter `matchList`.
- [ ] MatchCard: consider `<ul>/<li>` list semantics + `<h2>` heading order.

## Token gaps — Match Details audit (2026-06-10)
- [ ] Token gap (FaqItem): `#30445B` chevron (Figma Gray/800) — add e.g. `--color-ink-strong`
      or bless `ink-soft` as the substitute.
- [ ] Token gap (CourtCard): `32px/56px` display heading — largest type token is
      `--text-title` (28px); add `--text-display` or accept the one-off.
- [ ] Token gap (elevation, REOPENED): the "accepted as one-offs" call from 2026-06-08
      is stale — match details adds 4 recurring shadow values across 12+ usages
      (`0 2px 1.5px/5%`, `0 1px 2px/6%`, `0 2px 3px/5%`, `0 1px 4px/5%`) plus MatchCard's
      deepened `0 8px 24px/12%`. Add `--shadow-card` / `--shadow-chip` elevation tokens.
- [ ] Decision (gray ramp): during the match-details build, Figma grays with no token were
      mapped to nearest existing tokens — `#7B93AF` (Gray/400) and `#92A7C1` (Gray/300) →
      `muted`, `#57728E` (Gray/600) → `ink-soft`/`muted`, `#E9EDF5` (Gray/50) → `surface`.
      Bless these mappings or extend the neutral scale with ramp tokens.
