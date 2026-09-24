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

## v3 — 2026-09-24 | audit (wired share pill, shipped 2026-09-22)
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 3 | Warning | **The pill says «لینک کپی شد» when the copy failed.** `if (result !== "shared")` treats `"failed"` like `"copied"`, so on the one path `lib/share.ts` exists to handle, the header reports a copy that didn't happen. `ShareCard` does this correctly (shows the link instead). Fix: `result === "copied"`, and on `"failed"` either scroll to / reuse the card's fallback or show «کپی نشد». | Open |
| 4 | Warning | Label swap isn't announced. Same as ShareCard #2. Put `aria-live="polite"` on the pill's label. | Open |
| 5 | Suggestion | **A lone pill spans the full hero width.** `ActionPill` is `flex-1` in an `inset-x-4` row that used to hold two pills. With ویرایش gone, the share pill stretches ~358px with its icon and label pushed to opposite ends. Needs a look on the phone: `flex-none`, or right-align it. | Open — visual check |
| 6 | Suggestion | Stale docs: the header comment says "a drawn padel court … share/edit pills", and `bgImage`'s doc says "the hero is solid `bg-primary`". It's a photo now, with one pill. | Open |
| 7 | Suggestion | Title uses `[text-shadow:0_4px_26px_rgba(2,26,55,0.45)]` while a `drop-shadow-hero` token exists (predates 2026-09-22, commit c6a0141). Either use the token or accept it as the photo-header value. | Open — decision |

Regression check against v2: #1 still accepted; `.fixed-bar` still present.

### Status
Open: 5 | Fixed: 1 | Accepted: 1

## v4 — 2026-09-24 | fix
#3 Fixed v4 — the pill tracks the real result: «لینک کپی شد» on `"copied"`, «کپی نشد» on `"failed"`, nothing on `"shared"`.
#4 Fixed v4 — `ActionPill`'s label is `aria-live="polite"` (its only consumer is this pill, whose label is its status).

### Status
Open: 3 | Fixed: 3 | Accepted: 1
