# Session State

## Last session — 2026-06-08
Built the **Matches** feature from Figma, iterated on visuals from user feedback,
then ran a QA audit + refactor across all Matches components.

Components in `app/(main)/matches/_components/`:
- Base: `icons`, `IconButton`, `DateCell`, `StatusBadge`, `PlayerSlot`, `MetaItem`, `PriceTag`, `SelectChip`
- Compound: `DateSelector`, `MatchCard`, `MatchesHeader`, `FilterSection`, `BottomSheet`
- Layout: `SortSheet`, `FilterSheet` · Page: `app/(main)/matches/page.tsx`
- Data/types in `lib/`; header images in `public/images/matches-header-*.webp`.

### Feedback-driven fixes already applied
- Light-only app: removed dark-mode block in `globals.css`; `(main)` frame is `w-full max-w-[430px] bg-white`, header full-bleed.
- `BottomNav` centered to the frame; hidden behind sheets (sheet `z-[60]`).
- Sheets reworked to match Figma: glass (`bg-white/80` + blur), floating w/ insets, header close-left + title/badge-right, blue/white chips, gray+blue footer.
- Toman glyph icon replaces the literal "تومان" in card price (`TomanIcon`, currentColor).
- Card shadow deepened.

### QA pass (ds-qa-tw) — audit + refactor
Per-component audit files in `_designer/audits/`; index in `_designer/audits.md`.
- **BottomSheet (Critical fixed):** now `role="dialog"` + `aria-modal` + `aria-labelledby` (useId), Escape-to-close, body scroll lock, overlay `aria-hidden`, badge `aria-hidden`.
- **FilterSection:** added `role="group"` + `aria-label`.
- **Token-class fixes:** `rounded-[32px]`→`rounded-card` (MatchCard), `rounded-[48px]`→`rounded-full` / `rounded-[32px]`→`rounded-card` (SelectChip + sheet footers).
- Verified: `tsc --noEmit` clean, only pre-existing `<img>` lint warnings.

## Next / open
- **Token gaps logged in `TODO.md`** — gray scale, status colors, sheet radii, shadows. Human decision: add semantic tokens to `@theme` (and roll across profile/auth too) or accept.
- Wire Sort/Filter selections to actually sort/filter `matchList` (currently cosmetic local state).
- MatchCard: optional `<ul>/<li>` + `<h2>` heading-order polish (open suggestion).
- Accepted project-wide deviations (not changed): `<img>` over `next/image`; no `cn()`/`cva`/`forwardRef` on feature presentational components (clsx/cva not installed; matches StatCard/ProfileMeta style).
- A `_preview/MatchCard.html` was started via ds-preview-tw but interrupted — regenerate if a standalone preview is still wanted.
