# MatchDetailsHeader — Audit

## v1 — 2026-06-10 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Note | Backdrop/hero geometry arbitraries (`w-[128.7%]` etc.) | Accepted — proportional Figma placement (alignment fix, commit 8e9ff9b) |
| 2 | Suggestion | Share/ویرایش ActionPills cosmetic (no handlers) | Open — logged in session-state |

### Status
Open: 1 | Fixed: 0 | Accepted: 1

## v2 — 2026-09-22 | fix (API reality)
#2 Closed v2 — the **share pill shares**: it had no `onClick` at all, and now calls the same
`lib/share.ts` helper `ShareCard` uses, so both degrade the same way off a secure origin. The
**ویرایش pill is deleted** along with its `showEdit` prop — the API cannot update a match.
Also added `.fixed-bar`: the pill's label swaps to «لینک کپی شد» inside a fixed element, which
Safari does not reliably repaint without its own layer.

### Status
Open: 0 | Fixed: 1 | Accepted: 1
