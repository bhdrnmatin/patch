# Session State — Archive

Older sessions moved out of `session-state.md` to keep the hot file cheap to read.
Newest-first; see `session-state.md` for the current sessions.

---

## Session — 2026-07-21: token refresh rotation (15-min logout fixed)
Backend shipped `POST /auth/refresh` (`{refreshToken}` → `{accessToken, refreshToken}`, rotating;
verified via live spec + a bad-token 401 probe). Wired rotation in `lib/api/client.ts`:
proactive refresh of an expired token, reactive refresh-and-replay on 401, single-flight (concurrent
401s share one refresh), stores the rotated refresh token; only a dead refresh token calls
`endSession()`. `doRefresh` uses raw fetch (not apiFetch) to avoid recursion; `_retry` flag prevents
replay loops. This resolves the diagnosed 15-min-TTL logout. tsc + lint clean. Docs
(CHANGELOG/STATUS/TODO/memory) updated. Also noted: backend added `/provinces` + `/provinces/{id}/cities`
and `/players/me` gained fields — not wired yet (candidate for the city field).

## Session — 2026-07-20: profile-editing pass + logout diagnosis
Built out profile editing against the live API on `feat/profile-gender-select` (12 commits, merged
to `main` as `b09e815`, pushed to origin + patchapp; branch deleted, plus the stale
`patchapp/feat/api-auth-profile` cleaned up).

- **Profile-setup:** gender → `AuthSelect` dropdown (آقا/خانم → `MALE`/`FEMALE`); name/city/bio
  Persian-only via shared `toPersianOnly` (`lib/persian.ts`).
- **Edit profile:** new `/profile/edit/personal` (photo upload + bio, both invalidate `["me"]`);
  email/password rows commented out. Settings: delete-account → `LogoutRow` (`POST /auth/logout`),
  language/privacy commented out. Statistics row → "به زودی" (`NavRow comingSoon`).
- **/profile:** live avatar (`ProfileAvatarLive`) + bio (`ProfileIdentity`); `@username` hidden.
  Default `avatar-placeholder.svg` is now a Facebook-style silhouette; `ProfileAvatar` falls back to
  it on empty src **and** on `onError`.
- **Logout bug — DIAGNOSED (backend blocker):** used a temporary localStorage breadcrumb to catch
  it. Cause = **access-token TTL is 15 min** and there's **no `/auth/refresh`** (confirmed against
  live spec: 9 endpoints, refreshToken only used by logout). Not frontend-fixable. Frontend hardened
  meanwhile: 401 only logs out when the token is genuinely expired (`isAccessTokenExpired` decodes
  JWT `exp`), `["me"]` no longer refetches on focus, and `dev` pinned to `-p 3000` (port bounce was a
  separate origin-loss cause). Debug breadcrumb removed after diagnosis. Recorded in
  `project_api_integration.md`.
- **`/otp/request`** now completes (login works end-to-end) — the earlier 500 appears backend-fixed.

### Next
- Backend must raise the token TTL or ship `POST /auth/refresh`; then wire rotation in the marked
  `lib/api/client.ts` seam. Other follow-ups (profileStatus routing, 429 UI, assessment persistence)
  in TODO.md.

## Session — 2026-07-18 (later): connect auth + profile to the live API
Wired the first real API calls to `api.patchapp.ir` — branch `feat/api-auth-profile`
(committed `dfeb717`, pushed). The API is early: only auth (OTP) + player profile exist,
so everything else stays on the mock `lib/data` seam.

- **Infra (`lib/api/`):** `session` (localStorage bearer, SSR-guarded, reactive via
  subscribe/emit), `client` (`apiFetch`, typed `ApiError` reading the API's `errorMessage`
  envelope, 401 → clear+redirect, 204), `auth`/`players` modules, `useAuth` +
  `useRequireAuth`/`useRedirectIfAuthed`, `AuthGuard`. `toLatinDigits` added to `lib/persian.ts`.
- **CORS is OFF on the API** → proxy via `next.config.ts` `rewrites()` same-origin `/api/v1/*` →
  upstream (`API_BASE_URL`, server-only env; `.env.example` committed, `.env.local` ignored).
  Verified the proxy forwards (localhost `/api/v1/players/me` → upstream 401).
- **Wired:** login (requestOtp), otp (verify → tokens → route by profile completeness),
  profile-setup (`PUT` name+gender; city/assessment deferred), profile page live name
  (`ProfileIdentity` client island). Guards on `(main)`/`/profile`/`/matches/*`.
- **Verified:** tsc + lint clean, all 11 routes 200, no server errors. Endpoint health probed:
  ALL behave correctly EXCEPT **`POST /otp/request` 500s for every number** (backend SMS-send bug —
  it even sets the rate-limit then throws). Confirmed not a format issue (API normalizes
  `09…`/`+98…`/`98…` to one rate-limit bucket). verify 410s an expired code; profile endpoints 401;
  logout 204. So the frontend is correct; the live OTP path is blocked on the backend fix.
- **Decision:** left the 429 `retryAfter` UI until the endpoint works (no point polishing a broken one).
- **OTP length:** hoisted to `OTP_LENGTH` in `OtpInput` (removed the magic 5/4). Briefly set to 6,
  then reverted to **5** per user — the length now lives in one constant either way.
- **Memory:** saved `project_api_integration.md`. Docs updated (CHANGELOG/STATUS/TODO/this file).

### Next
- Backend must fix `/otp/request` before the flow can complete end-to-end.
- Then confirm gender string (enum vs Persian), switch OTP routing to real `profileStatus`, and
  verify the authed endpoints accept our payloads. Full follow-up list in TODO.md.

## Session — 2026-07-18: merge polish-pass to main + sync remotes
Shipped the `design/polish-pass` branch and reconciled the two remotes.

- **Merged** `design/polish-pass` → `main` with `--no-ff` (`7f56c21`), matching the repo's
  merge-commit convention. 50 files, +310/−91 (P1 tokens + P4 motion, with the P2/P3 revert
  already folded in).
- **Reconciled `patchapp` (Gitea):** local `main` and `patchapp/main` had diverged into disjoint
  histories — `patchapp/main` carried 18 deploy/infra commits (`.gitea/workflows/deploy.yml`,
  `Dockerfile`, `docker-compose.yml`) with none of the app work; local `main` had all the
  app/design work with none of the CI. Pulled + merged (clean, disjoint file sets).
- **Pushed** `main` to `patchapp` (`a59c98f..1bc0c2a`) — this triggers the Gitea deploy
  workflow — and to `origin`/GitHub (`616eb1b..1bc0c2a`). All three in sync.
- **Cleanup:** deleted `design/polish-pass` + the three merged `feat/*` branches. `main` is the
  only branch now. Updated CHANGELOG (Unreleased) + this file.
- **Reminder:** the `patchapp` remote URL still embeds a plaintext credential in `.git/config`
  (flagged 2026-07-12) — move to a credential helper when convenient.

### Next
- MatchCtaBar `danger` variant for لغو مسابقه (token exists); sheet exit animation. Both in TODO.md.

## Session — 2026-07-13: polish-pass review — P2 + P3 REJECTED and reverted
User kept P1 (tokens) + P4 (motion) but rejected P2 (tint demotions) and P3 (navy
duotone imagery): solid `bg-primary` fills and the original untreated imagery ARE the
intended look. All P2/P3 changes reverted (components + globals.css `.brand-media`
removed); the invisible font-weight sweep (medium/semibold → 400/700) was kept.
Rule recorded in CLAUDE.md ("Solid blue is the brand look") — don't redo these.

## Session — 2026-07-12 (later): design polish pass — branch `design/polish-pass`
User asked for an app-wide design-consistency + aesthetic pass ("act as a pro UI/UX
designer"). Approved direction: **Stripe-inspired refinement**, keep the palette, navy tint
over the AI imagery, **code becomes source of truth** (deliberate Figma departures OK).
Audit + plan in `_designer/polish-pass.md`; before/after full-page shots of all 18 routes in
scratchpad `audit-before/` / `audit-after/`. Installed the `frontend-design` skill
(~/.claude/skills, from anthropics/skills) and Playwright+Firefox in the scratchpad
(`shoot.mjs` — Firefox `--screenshot` fires before react-query hydration, don't use it for
list pages).

- **P1 tokens:** added success/success-soft/success-deep, danger, rounded-sheet 40px,
  shadow-sheet, drop-shadow-hero, text-tiny 10px; swept ALL hardcoded hexes, 6 one-off
  shadows, 14 arbitrary radii, one-off text sizes. CLAUDE.md token table updated.
- **P2 color discipline:** solid bg-primary only for the screen's primary action +
  selection states; InfoBanner/SectionCard icons/MatchCard price/StatusBadge-active/
  مسیریابی/ScoreStepper "+" → `bg-primary/10 text-primary`. Also removed ALL
  font-medium/font-semibold (Yekan Bakh has only 400/700 — they were synthesized).
- **P3 imagery ("night match" signature):** `.brand-media` wrapper in globals.css
  (saturate .72 + #2f7fc2 mix-blend-color at .62) applied to AuthSlide, StorySlide,
  SportPageHeader, MatchDetailsHeader, ProfileHero, PromoCard, TournamentPoster,
  StatusThumb; court map `saturate-50`. GOTCHA: unlayered CSS beats Tailwind's
  `@layer utilities`, so `.brand-media` must NOT set `position` — wrappers carry their own
  `relative`/`absolute` class (login bg collapsed to intrinsic height until fixed).
- **P4 motion:** sheet-in/fade-in keyframes (BottomSheet panel+overlay, AddMenu),
  base transition on button/a pressed states, global `:focus-visible` primary outline,
  `prefers-reduced-motion` respected everywhere.
- **Verified:** tsc clean, lint 0 errors (22 pre-existing img warnings), all routes
  re-screenshotted, sheet animation exercised via Playwright with zero console errors.

### Next
- Commit is pending user review (branch `design/polish-pass`, everything uncommitted).
- TODO.md additions: MatchCtaBar danger variant for لغو مسابقه; sheet exit animation;
  original posters on the future tournament-details page.
- Consider `ds-qa-tw` audit refresh on the touched shared components (BottomSheet,
  StatusBadge, InfoBanner, SportPageHeader…) — audit files predate the polish.

## Session — 2026-07-12
Built the **create-match wizard** (`/matches/create`) from two Figma WIREFRAMES (19946-34262 long
form, 19946-34346 review) — no styled design; translated into the system per user decisions:
6-step wizard (مشخصات→مکان→زمان‌بندی→بازیکنان→تنظیمات→اتمام) + simplified widgets (day strip +
month sheet instead of date wheel; heatmap built; map static/cosmetic). Plan in
`~/.claude/plans/we-want-to-work-smooth-barto.md`.

- **16 new components** in `app/matches/create/_components/` — first LIGHT-theme form primitives
  (TextField/TextArea/SelectField/OptionSheet/ToggleSetting), chrome (WizardHeader+StageDial reuse,
  StepChips, WizardFooter), 6 step components, AvailabilityHeatmap (7×4, free/half/blocked),
  TeamPreview, ReviewPlayers. Review step reuses DescriptionCard/ScheduleCard/CourtCard/InfoBanner.
- **Data:** `CreateMatchDraft`/`CourtOption`/`SlotAvailability`/`MonthOption`/`Daypart`/`ToggleSetting<T>`
  types; mocks `courtOptions`/`courtAvailability`/`wizardMonths`/`pickablePlayers`; accessors +
  `createMatch` mutation (unshifts into matchList, returns id → redirect to details as creator).
- **Shared tweaks (backward compatible):** ScheduleCard `deadline?`; DateCell/DateSelector
  `tone="light"` (glass selected-state was invisible on bg-surface — screenshots confirmed fix).
- **AddMenu rewired:** ساخت مسابقه → /matches/create.
- **Verified:** tsc+lint clean; all 6 steps screenshot-verified at 390px via temp `?demo=N` seed
  (reverted). Gating, RTL, chips, heatmap states all correct.
- **QA audit (ds-qa-tw, audit mode):** 0 Critical, 3 Warning, 3 Suggestion — StepChips 36px touch
  target, heatmap invalid `role="grid"`, footer missing `aria-busy`; SelectField aria-haspopup,
  current-chip keyboard access, legend-swatch fragility. 4 new audit files + 3 fix entries
  (DateCell/DateSelector/ScheduleCard); index + TODO.md updated.

- **Refactor pass (ds-qa-tw):** all 6 findings fixed — StepChips `h-11` + current chip enabled
  no-op; heatmap `role="grid"` removed (cells self-labeled) + `SWATCH_TONE` legend map;
  WizardFooter `aria-busy`; SelectField `aria-haspopup="dialog"`. tsc + lint clean, chips
  screenshot-verified. Audit files → v2, index + TODO.md updated.

- **Committed + pushed:** wizard merged as `616eb1b`, pushed with the results work (`0206fb8..616eb1b`).
- **Colleague review (oshaghisina/Patch):** fetched their fork (one commit `ca4f50c`: courts+booking,
  tournament details, recruiting, faithful-wireframe wizard at /matches/new, reworked ResultSheet,
  leaflet+jalaali deps). Ran side-by-side in a worktree on :3001; user REJECTED ("lots of problems").
  Worktree + remote removed. NOTE: `patchapp` remote has a plaintext password in .git/config — flagged.
- **Sort/Filter wired (/matches):** SortSheet/FilterSheet are now controlled (`MatchSort`/`MatchFilter`
  + exported DEFAULTs); page filters by status+levels, sorts by fee, empty-state message. Tournaments +
  activity pages (other sheet consumers) hold their own still-cosmetic state. Mock matchList
  diversified (distinct titles/statuses/levels/prices). Facets without backing fields stay inert
  (TODO.md). Verified via temp-default screenshot; tsc+lint clean. UNCOMMITTED.

### Next
- Commit the sort/filter wiring (+ optional ds-qa-tw pass on the changed sheets).
- Post-mock wiring in TODO.md: map picker, per-id storage, player ids, remaining facets.

## Session — 2026-07-11
Built the **result-entry** feature (`/matches/[id]/results`) — no Figma; designed from the
existing system + user decisions (points-per-team steppers, inline game cards), then user
correction: each game holds **multiple sets** (5+), not one score.

- **Flow:** creator × live CTA "وارد کردن نتیجه" now `router.push`es to the new page. The old
  `ResultSheet` (a filter-chip placeholder from Figma 20323:8226) was **deleted**; its audit file
  is marked REMOVED.
- **Components** (`results/_components/`): `GameCard` (h3 بازی N + 2 team columns of 2 slots +
  set list + افزودن ست), `PlayerSlotButton` (filled chip / dashed empty), `ScoreStepper`
  (−/value/+ per team per set), `PlayerPickerSheet` (BottomSheet + rows, used players disabled,
  tap current = clear slot). Page reuses profile `SubPageLayout` + `MatchCtaBar` (caption counts
  complete games). State: `GameEntry { teams: [TeamSlots×2], sets: [t1,t2][] }`, players are
  **indexes** into `matchDetails.players` (no id on `MatchPlayer` — TODO for API era).
- **Mock:** `matchDetails.players` were 6 identical clones — now 6 distinct names/levels
  (`detailPlayer()` helper) so the picker demo works.
- **Verified:** tsc + lint clean; headless-Firefox screenshots at 390px (empty, filled+picker,
  multi-set). Note: user's own snap Firefox blocks headless — use the raw binary
  (`/snap/firefox/*/usr/lib/firefox/firefox --headless --profile ~/.ff-headless-tmp`).
- **QA audit (ds-qa-tw):** 0 Critical, 5 Warning, 4 Suggestion across 4 components + page.
  5 audit files written; index + TODO.md updated.
- **Refactor pass (ds-qa-tw):** all 5 Warnings fixed — ScoreStepper `aria-live="polite"` +
  `hover:bg-edge` (floor-disable REJECTED: drops focus mid-interaction); PlayerSlotButton
  required `slotLabel` prop (breaking, only consumer updated); GameCard set-button aria-labels
  gained game context, `rounded-3xl` → `rounded-group`, h3 → h2; PlayerPickerSheet
  `aria-pressed`. tsc + lint clean, screenshot pixel-identical. Remaining open: set index keys
  (safe while controlled).
- **24px-radius sweep (user: "i want consistency"):** ALL `rounded-3xl` + `rounded-t/b-3xl`
  → `rounded-group` variants, app-wide (7 files: SectionCard, FaqSection, ScheduleCard,
  CourtCard, StoryCard, MatchCtaBar, MatchDetailsHeader). Corner variants compile in
  Tailwind v4 (verified via details-page screenshot). Rule added to CLAUDE.md token table:
  24px radius = `rounded-group`, never raw `rounded-3xl`.

### Next
- Update STATUS.md + CHANGELOG.md (feature not yet logged) and **commit** — everything is
  uncommitted on `main`.
- Wire real submit + player ids when API exists (TODO.md).

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
