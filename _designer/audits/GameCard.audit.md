# GameCard — Audit

## v1 — 2026-07-11 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Root uses `rounded-3xl` for the 24px card radius — ActivityCard was refactored to the `rounded-group` token for the same value (2026-06-17 blessing). SectionCard still uses `rounded-3xl`, so precedent is split; newest ruling says token class | Open |
| 2 | Warning | Per-set controls lack game context (rule 4.7): `حذف ست ۲` and the visible-text "افزودن ست" repeat identically across game cards. Include the game number in aria-labels (`حذف ست ۲ از بازی ۱`) | Open |
| 3 | Suggestion | Heading order: `<h3>بازی N</h3>` under the page's `<h1>` skips h2 (page has no h2). Use `<h2>` — same family as MatchCard's open heading-order suggestion | Open |
| 4 | Suggestion | Set rows keyed by array index — safe today (rows are fully controlled), but stable set ids would be more robust if sets ever gain local state | Open |
| 5 | Note | `bg-black/[0.08]` + `border-white/15` on remove buttons is the exact BottomSheet close-button recipe | Accepted — precedent |

Notes: RTL teams row handled correctly (dir=rtl with centered columns — the justify/items-end
trap doesn't apply; commented in code) ✓; remove-game button has contextual aria-label and is
withheld on the last game ✓; token-clean otherwise (divider/shadow-card/rounded-pill).

## v2 — 2026-07-11 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `rounded-3xl` → token | Fixed v2 — `rounded-group` (24px, identical render). SectionCard (match details) still on `rounded-3xl` — separate decision, left in TODO.md |
| 2 | Warning | Set buttons lack game context | Fixed v2 — `حذف ست N از بازی M`, `افزودن ست به بازی M` aria-labels; stepper labels now `تیم X در ست N بازی M`; hoisted `gameNo` |
| 3 | Suggestion | h3 skips h2 | Fixed v2 — `<h2>بازی N</h2>` (page h1 → card h2) |
| 4 | Suggestion | Set rows keyed by index | Open — safe while rows are fully controlled; revisit if sets gain ids/local state |

Regression check against v1: RTL teams row, remove-game guard, tokens still clean; screenshot
pixel-identical (24px radius unchanged).

### Status
Open: 1 | Fixed: 3 | Accepted: 1
