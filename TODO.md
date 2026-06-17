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
- [x] Token gap (FaqItem) — **resolved 2026-06-11**: `ink-soft` blessed as the substitute
      for `#30445B`; chevron swept.
- [x] Token gap (CourtCard) — **resolved 2026-06-11**: added `--text-display` (32px/56px)
      to `@theme`; club heading uses `text-display`.
- [ ] Token gap (elevation, REOPENED): the "accepted as one-offs" call from 2026-06-08
      is stale — match details adds 4 recurring shadow values across 12+ usages
      (`0 2px 1.5px/5%`, `0 1px 2px/6%`, `0 2px 3px/5%`, `0 1px 4px/5%`) plus MatchCard's
      deepened `0 8px 24px/12%`. Add `--shadow-card` / `--shadow-chip` elevation tokens.
- [x] Decision (gray ramp) — **blessed 2026-06-11**: nearest-token mapping is the rule
      (documented in CLAUDE.md Design Tokens); no ramp tokens added.

## Tournaments — audit (2026-06-16)
### Behavior wiring (post-mock)
- [ ] TournamentCard: make the "جزئیات تورنومنت" CTA a `<Link href="/tournaments/{id}">`
      once the detail route exists (currently a dead `<button>`). Same shape as the MatchCard CTA item.
### Token gaps
- [x] Token gap (TournamentPoster): `rounded-[20px]` (20px radius) — **accepted as one-off 2026-06-16**
      (consistent with sheet 40px / close 20px single-use radii). Revisit if a second consumer appears.
- [x] Token gap (PosterBadge): `backdrop-blur-[4px]` — **accepted as one-off 2026-06-16** (meaningful
      over the poster). The TournamentCard CTA's no-op copy was **removed** in the refactor.
### Refactor candidates (Warnings)
- [x] PosterBadge duplicated StatusBadge's status→Persian labels — **fixed 2026-06-16**: extracted to
      `lib/status.ts` (`statusLabels`); both components import it.
- [x] SportPageHeader inverted dependency — **fixed 2026-06-16**: relocated `icons`, `IconButton`,
      `DateCell`, `DateSelector` from `matches/_components` to the shared `(main)/_components/`; all
      importers (matches, tournaments, match-details `[id]`) repointed. `PriceTag` + sheets stay in
      matches (feature→feature reuse). CLAUDE.md component-library section updated.

## Activity — audit (2026-06-17)
### Behavior wiring (post-mock)
- [ ] ActivityCard actions are placeholder `<button>`s (no onClick/navigation) — wire to the relevant
      flows (cancel/pay/approve/details) when those exist.
- [ ] Wire `/activity` into BottomNav (nav has 4 tabs + add; no Activity slot — page shows no active tab).
### Refactor candidates
- [x] ActivityCard (Warning): card title `<span>`s → **fixed 2026-06-17**: wrapped in `<h3>`.
- [x] ActivityCard: `rounded-3xl` → `rounded-group` token — **fixed 2026-06-17**.
- [x] ActivityButton: filled hover — **fixed 2026-06-17** (`hover:bg-primary-hover` / outline `hover:bg-surface`).
      `flex-1` layout opinion kept (intended row-fill, inert standalone).
### Token gaps
- [x] Token gap (StatusThumb): `w-[91px]`, `text-[10px]` — **accepted as one-offs 2026-06-17** (Figma
      dimension / DateCell precedent).
- [x] Token gap (ActivityCard): `border-divider` for the #E9EDF5 card border — **accepted 2026-06-17**
      (nearest visible token; blessed map's #E9EDF5→surface is too light for a border).
