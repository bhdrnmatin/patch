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
