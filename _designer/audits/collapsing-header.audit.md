# Collapsing hero header — Audit

The scroll-collapse mechanism shared by the list pages and profile:
`lib/useCollapseHeader.ts` + the `.hero-collapse*` rules in `app/globals.css`,
consumed by `app/(main)/_components/SportPageHeader.tsx` (matches / activity /
tournaments) and `app/profile/_components/ProfileHero.tsx`.

## v1 — 2026-08-08 | audit

One `--collapse` value (0 open → 1 collapsed) is written onto the header element on
scroll; every part sizes itself off it in CSS. The hook writes straight to the DOM inside
a `requestAnimationFrame`, never through React state, so scrolling re-renders nothing —
good call for a per-frame value. `window` is only touched inside `useEffect`, so SSR is
safe. Both headers are `fixed` with a same-height spacer in flow, which is what keeps the
document from reflowing mid-scroll (an in-flow shrinking header would yank the content
under the user's thumb). Listener is `{ passive: true }` and cleaned up, with the rAF
cancelled on unmount.

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | **Collapsed touch targets fall under the project's own 44px minimum.** CLAUDE.md states "touch targets ≥ 44px". Fully collapsed, `.hero-collapse-actions` scales the 48px `IconButton`s by 0.78 → **37.4px**, and `.hero-collapse-dates` scales the 52px `DateCell`s by 0.8 → **41.6px**. Filter, sort and every day cell are below the minimum exactly when the header is pinned and most likely to be tapped. Options: cap the action scale at ~0.92 (44px), or keep the visual shrink and restore hit area with padding on the button rather than scaling the whole box. | Open |
| 2 | Warning | **The collapsed heights are hand-derived from numbers that live in a different file.** `HERO_MIN_WITH_DATES = 120` was computed from the CSS positions (`top: 80px` title, `56px` actions, the 0.78/0.8 scales) so the shrunken date strip clears the title row — but nothing links them. Editing `.hero-collapse-title`'s `top` in `globals.css` silently invalidates the constant in `SportPageHeader.tsx`, and the failure mode is overlapping controls. Both bugs shipped in this feature (dead space above; the date strip landing on the title) came from exactly this arithmetic. Either derive the min height in CSS, or move the layout numbers into the component as CSS vars so one file owns them. | Open |
| 3 | Warning | **The hook's contract is enforced only by comment.** `useCollapseHeader(range)` documents that `range` *must* equal the header's height delta, then leaves the caller to also set `--hero-max`/`--hero-min` inline and size the spacer — three coupled duties, all silently breakable. A `useCollapseHeader({ max, min })` that derives the range, sets both custom properties and hands back the spacer height would make the invariant unbreakable (Rule 5.3). | Open |
| 4 | Suggestion | The hook assumes the window is the scroll container (`window.scrollY` + `scroll` on `window`). True for every page today, silently wrong the moment a page scrolls inside a container. Worth stating in the doc comment or accepting a target. | Open |
| 5 | Suggestion | ~40 lines of header shell (blurred backdrop + tint + gradient + fixed/spacer scaffolding + title) are duplicated between `SportPageHeader` and `ProfileHero`. They genuinely differ (actions + date strip vs a straddling avatar, and ProfileHero needs an inner clipped layer so the avatar can hang out), so a shared shell would need slots — worth it only if a third collapsing header appears. | Open |
| 6 | Accepted | Inline `style` for `--hero-max`/`--hero-min` and the photo's `height` | Accepted — the custom properties are dynamic by nature, and the photo height is deliberately read from `HERO_MAX` rather than written as `h-[276px]`, which is what stopped the constant being duplicated in four places (Rule 2.2's static-value ban doesn't fit a value whose whole point is to track a JS constant). |
| 7 | Accepted | No `prefers-reduced-motion` handling | Accepted — the collapse is scroll-linked, not animated. Freezing it would strand the header at whatever size the last scroll left it. |
| 8 | Accepted | `.hero-collapse-dates` widens by the inverse of its scale and re-centres | Accepted — scaling a full-width scroll container about its centre pulled ~39px off each end and clipped the edge cells; the inverse-width compensation is the fix, and the reasoning is commented in place. |
| 9 | Note | **Nothing here has been verified in a browser** — no Chrome on the dev machine, so all geometry (collapsed heights, clearances, the avatar's travel to the collapsed title row) is hand-computed. Two bugs already reached the device this way. An audit reads code; it cannot catch a date strip landing on a title. | Open — needs device check |

### Status
Open: 0 Critical, 3 Warning, 2 Suggestion (+1 device-verification note) | Fixed: 0 | Accepted: 3
