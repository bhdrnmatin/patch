# Session State

## Last session — 2026-06-10
Desktop-safety + font swap + housekeeping.

- **430px cap everywhere:** all auth pages, `/profile`, profile sub-pages
  (`SubPageLayout`) now render as a centered `max-w-[430px]` column; body
  backdrop set to black (`globals.css` + root layout) so the frame is visible
  on laptop viewports.
- **Font switched to Yekan Bakh:** local OTFs (400/700) in `app/fonts/` via
  `next/font/local`, replacing the Vazirmatn Google font. Variable renamed
  `--font-vazirmatn` → `--font-yekan-bakh` across globals, auth pages, CLAUDE.md.
  Body font-family now applies it app-wide (main pages were silently Arial before).
- **Committed:** `268a1c0` (font + width cap), `8a31d1f` (the 2026-06-08 Matches
  work, previously uncommitted). Working tree clean.
- **Docs:** created `CHANGELOG.md` (full history from git); STATUS.md font line
  fixed + links to TODO.md/CHANGELOG.md added.

### Later in session (2026-06-10)
- **Token gaps resolved:** neutral scale added to `@theme` (`ink`, `ink-soft`, `muted`,
  `surface`, `divider`, `edge`); all 32 hardcoded grays swept to token classes;
  StatusBadge colors / radii / shadows accepted as one-offs. Committed `ebe0dd6`.
- **CHANGELOG.md created** (`e1e4287`) with full history + Unreleased section.
- **AddMenu pattern (Figma 20211:6526):** plus button in `BottomNav` now toggles a
  speed-dial — `bg-black/45 backdrop-blur-[4px]` backdrop (z-40, nav stays at z-50),
  three glass action rows anchored `bottom-full mb-4` inside the nav. New inline
  `WhistleIcon`/`CourtIcon`; `MatchesIcon` reused. Closes on backdrop/Escape/selection.
  Spec + HTML prototype + audit in `patterns/`. Rows link to section pages
  (`/tournaments`, `/matches`, `/courts`) until real create flows exist.

- **Match Details feature (6 Figma frames):** built `/matches/[id]` — one route,
  sections toggle/reorder by viewer role × match status (the 6 frames are one page
  with two axes; pixel-diff confirmed). Demo via `?role=creator|player&status=upcoming|live|finished`.
  20 components in `app/matches/[id]/_components/` (outside `(main)` → no BottomNav;
  page has its own sticky `MatchCtaBar`). Reused `IconButton`, matches icon set,
  BottomNav glyphs (now exported). New types/mock in `lib/`. Hero/promo/map images
  optimized into `public/images/`. Build + smoke test (200 on both roles) pass.

- **QA audit of Match Details (ds-qa-tw, 22 components):** 0 Critical, 5 Warning,
  6 Suggestion. Per-component audits in `_designer/audits/` (12 new files), index
  updated. Token gaps + gray-ramp decision logged in TODO.md; elevation-shadow
  "accepted" decision REOPENED (now 4 recurring values × 12+ uses). TOKEN GAP
  comments added at FaqItem chevron + CourtCard display heading. No code fixes
  applied (audit mode).

- **Refactor pass (2026-06-11):** fixed FaqItem aria-controls, SectionCard icon size
  (size-6), ScheduleCard gap-4.5, PromoCard root margin (now margin-free 127px wrapper),
  PlayersSection ul/li. Open: MatchInfoCard icon-import home + the TODO token decisions.

### Next
- Decide TODO.md token items: gray ramp mapping, elevation tokens, #30445B, 32px display size.
- Wire AddMenu rows to real create/reserve flows when those pages get designed.
- Link `MatchCard` in the `/matches` list to `/matches/[id]` (not wired yet).
- Match Details buttons are cosmetic: share, add-to-calendar, مسیریابی, accept/reject,
  CTA actions need real behavior; "همه" players link needs a destination.
- Visual QA of `/matches/[id]` against the 6 frames on a phone viewport.
- Wire Sort/Filter sheet selections to actually sort/filter `matchList`.
- Open audit findings (1 each): SortSheet, FilterSheet, MatchCard, ProfilePage.
- Note: Yekan Bakh ships only 400/700 — `font-medium`/`font-semibold` render
  synthesized weights; check visuals where those classes are used.

## Previous session — 2026-06-08
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
