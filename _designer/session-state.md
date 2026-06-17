# Session State

## Session — 2026-06-17
Built the **Activity** list page (`/activity`) from Figma (`node-id=20176-13603`), then audited it.

- **Components** (`activity/_components/`): `StatusThumb` (91×112 court thumb + status overlay),
  `ActivityButton` (compact pill, outline/filled), `SectionDivider` (hairline + optional labels),
  `ActivityCard` (title + 3 meta lines + thumb + 1–2 actions). Page = 3 sections of cards + dividers.
- **SportPageHeader** extended (3rd consumer): optional date strip (`days?`) + configurable
  `bgImage`/`athleteImage` (default to matches scene). `/matches` + `/tournaments` unchanged.
- **Data:** `ActivityItem`/`ActivityAction`/`ActivityMetaLine`/`ActivitySection` + `activitySections` mock.
- **Header art (user feedback, 2 rounds):** the Figma backdrop bakes the player into the scene, so a
  plain blurred-bg + cutout ghosted. Fixed by baking ONE image at Figma's exact layer geometry —
  scene blurred+tinted (right-anchored w-413) with the sharp player (left, object-cover) composited on
  top, aligned so he covers his blurred self. `public/images/activity-header.webp` (12KB).
- **Meta alignment (user feedback):** fixed the RTL `items-end` trap (was pinning text left).
- **QA audit (ds-qa-tw):** 0 Critical, 1 Warning (card title not an `<h3>`), 6 Suggestions. 3 audit
  files + SportPageHeader v3 note; index + TODO updated.
- **Refactor pass (ds-qa-tw):** fixed the Warning + 2 suggestions — ActivityCard title → `<h3>`,
  `rounded-3xl` → `rounded-group`; ActivityButton filled/outline hover states. tsc + lint clean,
  card renders unchanged. Remaining open are systemic (focus-visible, heading semantics) or accepted.

### Next
- Wire `/activity` into BottomNav + card actions to real flows.
- **Commit:** the whole Activity feature is still UNCOMMITTED on `main` (build + header fixes + audit docs).

## Previous session — 2026-06-10
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

- **Token decisions applied (2026-06-11):** gray-ramp mapping blessed (rule in CLAUDE.md),
  `--shadow-card`/`--shadow-pop` elevation tokens (14 usages swept), `--text-display`
  (32px/56px) for CourtCard heading, `#30445B` → `ink-soft`. All four TODO items closed.

### Next
- Wire AddMenu rows to real create/reserve flows when those pages get designed.
- Link `MatchCard` in the `/matches` list to `/matches/[id]` (not wired yet).
- Match Details buttons are cosmetic: share, add-to-calendar, مسیریابی, accept/reject,
  CTA actions need real behavior; "همه" players link needs a destination.
- Visual QA of `/matches/[id]` against the 6 frames on a phone viewport.
- Wire Sort/Filter sheet selections to actually sort/filter `matchList`.
- Open audit findings (1 each): SortSheet, FilterSheet, MatchCard, ProfilePage.
- Note: Yekan Bakh ships only 400/700 — `font-medium`/`font-semibold` render
  synthesized weights; check visuals where those classes are used.

## Session — 2026-06-16
Built the **Tournaments** list page (`/tournaments`) from Figma (`node-id=20176-13411`),
then ran a QA audit.

- **Reuse-first build:** ~70% reused from Matches — `IconButton`, `DateSelector`/`DateCell`,
  `PriceTag`, `BottomSheet`/`FilterSection`/`SelectChip`, `FilterSheet`/`SortSheet`, icons,
  the hero image, and the global `BottomNav`. New components: `TournamentCard`, `TournamentPoster`,
  `PosterBadge`, `InfoPair` (tournaments/_components) + `SportPageHeader` ((main)/_components).
- **Header generalized:** extracted the Matches hero into shared `SportPageHeader` (title prop);
  `MatchesHeader` is now a thin wrapper — Matches output unchanged.
- **Data:** `TournamentListItem` type + `tournamentList` mock; reused `matchDays`. Poster asset
  `public/images/tournament-poster.webp` (740px, q80).
- **RTL fixes from user feedback:** title + info-grid were left-aligned because `dir="rtl"` flips
  `justify-end`/`items-end` to the left — fixed by keeping those wrappers LTR with RTL on the text.
  Verified against Figma via headless-Chrome screenshots. Committed `4717740` on `feat/tournaments-page`.
- **QA audit (this skill):** 0 Critical, 3 Warning, 5 Suggestion across 5 components. No code changes
  (audit mode). 3 new audit files + MatchesHeader v2 (wrapper) note; index + TODO updated.
  Warnings: SportPageHeader inverted dependency (accepted cross-folder pattern), PosterBadge duplicates
  StatusBadge labels, TournamentCard CTA is a dead button. Token gaps logged: `rounded-[20px]`,
  `backdrop-blur-[4px]`.

- **Refactor pass (2026-06-16):** shared `statusLabels` map (`lib/status.ts`, used by StatusBadge +
  PosterBadge); dropped the no-op CTA `backdrop-blur-[4px]`; `InfoPair.label` → ReactNode. Token gaps
  `rounded-[20px]`/`blur-[4px]` accepted as one-offs. Committed `45050c1`.
- **Dependency-inversion fix (2026-06-16):** relocated the shared leaves `icons`, `IconButton`,
  `DateCell`, `DateSelector` from `(main)/matches/_components/` → shared `(main)/_components/`.
  SportPageHeader (shared) no longer reaches into the matches feature. ~15 importers repointed across
  matches, tournaments, and match-details (`app/matches/[id]`). `PriceTag` + filter/sort sheets stay
  in matches (feature→feature reuse, not the inversion). CLAUDE.md component library + tournaments
  STATUS.md updated. Verified: tsc clean, three routes 200, headers render unchanged.

### Next
- Wire the TournamentCard CTA to `/tournaments/[id]` once that route is designed.
- Optional further cleanup: PriceTag + Filter/SortSheet are still imported by tournaments from
  matches (feature→feature). Move to the shared layer only if a third consumer appears.

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
