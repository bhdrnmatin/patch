# Activity — Build Status

Figma: `node-id=20176-13603` (فعالیت‌ها list page)

Legend: `[ ]` todo · `[x]` done · `[R]` reused (no work)

## Data
- [x] `ActivityItem` / `ActivityAction` / `ActivityMetaLine` / `ActivitySection` types — `lib/types.ts`
- [x] `activitySections` mock (3 sections, 8 cards) — `lib/mock/index.ts`

## Base components (`activity/_components/`)
- [x] `StatusThumb` — 91×112 court thumbnail + dark status-label overlay
- [x] `ActivityButton` — compact pill action, `variant: outline | filled`, fills row slot
- [x] `SectionDivider` — hairline with optional `right`/`left` labels

## Compound components (`activity/_components/`)
- [x] `ActivityCard` — title (1–2 parts) + 3 meta lines + `StatusThumb` + 1–2 actions

## Layout
- [x] `SportPageHeader` — made `days`/`selectedId`/`onSelect` optional so the hero
      renders without a date strip (Activity). Also added optional `bgImage`/`athleteImage`
      props (default to the matches scene) so Activity uses its own header art.
      /matches + /tournaments unaffected.

## Page
- [x] `activity/page.tsx` — header + 3 sections + filter/sort sheets

## Reused as-is (do NOT recreate)
- [R] `SportPageHeader` — (main)/_components (date strip now optional)
- [R] `FilterSheet`, `SortSheet` — matches/_components (match facets; revisit if activity-specific)
- [R] `BottomNav` — (main)/_components (global in layout)
- [R] icons `FilterSearchIcon` / `SortIcon`, hero images — via header

## Assets
- [x] `public/images/activity-court.webp` — card thumbnail (360px, q80)
- [x] `public/images/activity-header.webp` — baked header: the Figma Activity scene blurred + tinted,
      with the sharp player composited back on top aligned (covers his blurred self → no ghost).
      Passed as `athleteImage`; the opaque image covers the header's default bg layer.
      Built from Figma assets image185 (scene) + image211 (player cutout).

## Notes / open
- [ ] Route `/activity` is not wired into `BottomNav` (nav has 4 tabs + add; no Activity slot).
      Decide nav placement before shipping — no tab highlights on this page yet.
- [ ] Card actions are placeholders (no onClick / navigation) — same status as the other list cards.
- Meta `faint` tone (#92A7C1) renders as `muted` per the blessed gray-ramp rule (no ramp token).
