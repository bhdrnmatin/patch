# TODO

## Token gaps — Matches audit (2026-06-08)

The Matches components use recurring hardcoded grays with no token (consistent
with existing components like StatCard/ProfileMeta, which hardcode the same hexes).
Decide: add semantic tokens to `app/globals.css` `@theme`, adjust the design, or accept.

- [ ] Token gap (gray scale): `#00254D` (ink), `#253343` (meta ink), `#6783A0` (muted —
      note `--color-input-border` is the same hex but semantically a border), `#F5F7FA`
      (surface), `#E5EAF0` (divider), `#D0DDEC` (avatar bg) — add semantic tokens
      (e.g. `--color-ink`, `--color-muted`, `--color-surface`, `--color-divider`) +
      use across Matches **and** existing profile/auth components.
- [ ] Token gap (StatusBadge): held `#E8F5E9`/`#2E7D32`, not-held `#F5F7FA`/`#6783A0` —
      add status tokens or accept as one-offs.
- [ ] Token gap (radii): `rounded-[40px]` (sheet), `rounded-[20px]` (sheet close),
      `rounded-b-[24px]` (header) — add `--radius-sheet` / reuse `--radius-group` (24px)?
- [ ] Token gap (shadows): card, sheet, and chip `shadow-[…]` values — add elevation tokens.

## Matches — behavior wiring (post-mock)
- [ ] Wire SortSheet selections to actually sort `matchList`.
- [ ] Wire FilterSheet selections to actually filter `matchList`.
- [ ] MatchCard: consider `<ul>/<li>` list semantics + `<h2>` heading order.
