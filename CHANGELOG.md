# Changelog

All notable changes to this design system are documented here.
Dates are in YYYY-MM-DD format. Newest entries first.

---

## Unreleased
*(changes not yet tagged/deployed)*

- [Profile] Profile-editing pass wired to the live API (branch `feat/profile-gender-select`, merged to `main`):
  - [Profile-setup] Gender is now a dropdown (`AuthSelect`) with آقا/خانم storing the backend enum `MALE`/`FEMALE` directly. Name/lastname/city inputs are Persian-only (a shared `toPersianOnly` in `lib/persian.ts` strips Latin letters/digits, keeps ZWNJ/spaces)
  - [Edit profile] New `/profile/edit/personal` page (the اطلاعات فردی row now works): profile-photo upload (`POST /players/me/profile-photo`, multipart) + bio editor (`PUT /players/me/display-info`), both invalidating the shared `["me"]` query; bio is Persian-only. Email + change-password rows commented out (flows don't exist yet)
  - [Profile] `/profile` shows the live avatar and bio (`ProfileAvatarLive` island + bio in `ProfileIdentity`); `@username` line hidden. Default avatar is now a Facebook-style silhouette (`avatar-placeholder.svg`), used when no photo is set **or** a photo URL fails to load (`onError`)
  - [Settings] Replaced the delete-account row with a **خروج از حساب** logout row (`LogoutRow` → `POST /auth/logout`, clears session, redirects to /login; resilient to a failed server call); commented out انتخاب زبان and حریم شخصی
  - [Statistics] مشاهده آمار deactivated with a "به زودی" label (`NavRow` `comingSoon`); route/page kept
  - [Auth] Hardened against spurious logouts — a 401 only ends the session when the token is genuinely missing/expired (`isAccessTokenExpired` decodes the JWT `exp`), not on transient backend 401s; the `["me"]` query no longer refetches on tab refocus. **Known backend blocker:** access-token TTL is only **15 min** and there's no `/auth/refresh`, so users still get logged out ~15 min in — needs a backend TTL bump or a refresh endpoint (see TODO)
  - [DX] `dev` script pinned to `-p 3000` so the dev server can't silently bounce to :3001 (which changed the origin and wiped the per-origin localStorage token)

- [API] Connected the auth + profile flows to the live backend (`api.patchapp.ir`), on branch `feat/api-auth-profile`. The API is early — only auth (OTP) and player profile exist, so every other feature stays on the mock `lib/data` seam:
  - [Infra] New `lib/api/` module — `session` (localStorage bearer tokens, SSR-guarded, reactive), `client` (`apiFetch` with typed `ApiError` reading the API's `errorMessage` envelope, 401 → clear session + redirect, 204 handling), `auth`/`players` endpoint modules, and a `useAuth` hook with `useRequireAuth`/`useRedirectIfAuthed` guards + an `AuthGuard` wrapper
  - [Infra] The API sends no CORS headers, so `next.config.ts` rewrites same-origin `/api/v1/*` to the upstream host (server-only `API_BASE_URL`); `.env.example` documents it. Added `toLatinDigits` to normalize Persian phone/OTP input
  - [Auth] Login requests an OTP; the OTP page verifies → stores tokens → routes by profile completeness; profile-setup `PUT`s name+gender (city + the assessment stay local/deferred — no fields yet); the profile page shows the live name via a client island. Protected routes ((main), /profile, /matches/*) redirect to /login; login/otp redirect home when already authed
  - [Auth] OTP length hoisted to an `OTP_LENGTH` constant in `OtpInput` (5 digits; was a hardcoded magic number)
  - [Status] tsc + lint clean, all routes 200, the same-origin proxy is verified forwarding to the upstream. The live OTP happy path is **blocked on a backend bug** — `POST /otp/request` 500s for every number (SMS send throws); all other endpoints behave correctly (verify 410s an expired code, profile endpoints enforce 401, logout 204)

- [Repo] Merged `design/polish-pass` into `main` (`--no-ff`, `7f56c21`); reconciled with the `patchapp` remote (Gitea) by pulling its 18 deploy/infra commits — `.gitea/workflows/deploy.yml`, `Dockerfile`, `docker-compose.yml` (removed) — into `main` via a clean, disjoint merge. `main` pushed to both `patchapp` and `origin` (GitHub); the push to `patchapp/main` triggers the Gitea deploy workflow. Merged branches (`design/polish-pass`, three `feat/*`) deleted — `main` is now the only branch.

- [Design polish] Consistency pass on `design/polish-pass` (audit + plan in `_designer/polish-pass.md`; the color-discipline and imagery-duotone phases were built, reviewed, and rejected by the user — solid-blue usage and original imagery restored):
  - [Motion] Bottom sheets and the AddMenu now animate in (slide-up panel + fading backdrop, `prefers-reduced-motion` respected); all buttons/links ease their pressed states; keyboard focus shows a visible primary outline
  - [Tokens] New: `success`/`success-soft`/`success-deep` + `danger` status colors (StatusBadge, JoinRequestRow, BottomNav dot), `rounded-sheet` 40px, `shadow-sheet`, `drop-shadow-hero`, `text-tiny` 10px. Swept the last hardcoded hexes (`#445A74` ×13 etc.), 6 one-off shadows, 14 arbitrary radii, and one-off text sizes to token classes
  - [Typography] `font-medium`/`font-semibold` removed app-wide — Yekan Bakh only ships 400/700, so those classes rendered synthesized fakes; hierarchy now uses honest `font-bold`/regular

- [Matches] Sort/Filter sheets now actually work on `/matches` — filter by وضعیت and رده‌بندی, sort by هزینه ورودی (least/most), with an empty-state message; sheets became controlled components (`MatchSort`/`MatchFilter`), and the tournaments/activity pages hold their own sheet state (facets without backing data select but don't narrow yet)
- [Mock] The three list matches now have distinct titles, statuses, levels, and prices (were identical clones — filtering was undemonstrable)
- [Create Match] New 6-step wizard at `/matches/create` (مشخصات → مکان → زمان‌بندی → بازیکنان → تنظیمات → اتمام), designed from wireframes with the site design system: step chips + progress ring, per-step validation gating, court search grid or custom address + map, court-availability heatmap (7 days × 4 dayparts, tap to pick the slot), teammate picking with team preview, بله/خیر settings toggles, and a review step composed from the existing match-details cards; "تایید و ثبت" creates the match (mock mutation) and lands on its details page as creator
- [Create Match] 16 new components in `app/matches/create/_components/`, including the app's first light-theme form primitives (`TextField`, `TextArea`, `SelectField`, `OptionSheet`, `ToggleSetting`); new wizard types/mocks/accessors + `createMatch` in the data layer
- [BottomNav] AddMenu's "ساخت مسابقه" now opens `/matches/create` (was the matches list)
- [ScheduleCard] `deadline` prop now optional — the مهلت یارگیری row hides when absent
- [DateCell/DateSelector] New `tone="light"` variant for bg-surface pages (selected day renders solid primary); default glass rendering unchanged

- [Results] New `/matches/[id]/results` page — the creator of a live match registers game results: any number of 2v2 games, each with player slots (picker sheet disables already-placed players; tapping the current player clears the slot) and any number of sets scored via −/+ steppers; the live-creator CTA "وارد کردن نتیجه" now navigates here (breaking: the placeholder `ResultSheet` was removed)
- [Results] 4 new components in `app/matches/[id]/results/_components/`: `GameCard`, `PlayerSlotButton`, `ScoreStepper`, `PlayerPickerSheet`; QA pass applied — `aria-live` score announcements, contextual aria-labels on repeated slots/set buttons, `aria-pressed` on picker rows
- [Mock] `matchDetails.players` are now 6 distinct players (were identical clones — picker was untestable)
- [Tokens] 24px radius consolidated: every `rounded-3xl` / `rounded-t-3xl` / `rounded-b-3xl` app-wide → `rounded-group` variants (SectionCard, FaqSection, ScheduleCard, CourtCard, StoryCard, MatchCtaBar, MatchDetailsHeader); rule documented in CLAUDE.md — no visual change

- [Tokens] Added neutral-scale tokens to `@theme`: `ink` #00254D, `ink-soft` #253343, `muted` #6783A0, `surface` #F5F7FA, `divider` #E5EAF0, `edge` #D0DDEC — all hardcoded gray hexes across Matches/profile/nav components replaced with token classes (no visual change)
- [Tokens] StatusBadge green pair, sheet radii, and shadows reviewed and accepted as one-offs (see TODO.md)
- [BottomNav] Plus button now opens the AddMenu speed dial (Figma 20211:6526): blurred dim backdrop, three glass action rows — ساخت تورنومنت / ساخت مسابقه / رزرو زمین — closing on backdrop tap, Escape, or selection; new `WhistleIcon` / `CourtIcon` inline icons (breaking: plus no longer links to /courts)
- [Patterns] AddMenu spec, HTML prototype, and audit in `patterns/`
- [Match Details] New `/matches/[id]` page from 6 Figma frames — creator/player × not-started/started/finished (demo via `?role=&status=`): hero header, stage dial, info grid, schedule, description, players grid, promo, court card with map, share card, FAQ accordion, join requests (creator), sticky CTA bar
- [Match Details] 20 new components in `app/matches/[id]/_components/`; `MatchDetails`/`JoinRequest`/`FaqEntry` types + mock; hero/promo/map images in `public/images/`
- [BottomNav] `MatchesIcon`/`WhistleIcon`/`CourtIcon` now exported for reuse
- [Layout] Page background is `bg-surface` (#F5F7FA) per Figma — `(main)` layout, profile, profile sub-pages, match details; cards keep Figma shadows (white-on-surface gives the contrast)
- [Tokens] Elevation tokens `shadow-card` / `shadow-pop` added; 14 arbitrary shadow values swept (match details, MatchCard, profile NavRow)
- [Tokens] `text-display` (32px/56px) added for display headings (CourtCard club name)
- [Tokens] Gray-ramp mapping blessed: Figma Gray/50–800 render via `surface`/`muted`/`ink-soft` (rule documented in CLAUDE.md); FaqItem chevron `#30445B` → `ink-soft`

---

## 2026-06-10

### Added
- Matches flow: `/matches` page with hero header, date selector, match cards, and Sort/Filter bottom sheets
- 15 Matches components in `app/(main)/matches/_components/`: `icons`, `IconButton`, `DateCell`, `StatusBadge`, `PlayerSlot`, `MetaItem`, `PriceTag`, `SelectChip`, `DateSelector`, `MatchCard`, `MatchesHeader`, `FilterSection`, `BottomSheet`, `SortSheet`, `FilterSheet`
- `MatchListItem` / `MatchStatus` types in `lib/types.ts`; mock matches and dates in `lib/mock`
- [Tokens] Yekan Bakh font as local OTFs (weights 400/700) via `next/font/local`

### Changed
- [Tokens] App font switched from Vazirmatn (Google Fonts) to Yekan Bakh — CSS variable renamed `--font-vazirmatn` → `--font-yekan-bakh`; replace any `var(--font-vazirmatn)` usage (breaking)
- All pages constrained to a centered `max-w-[430px]` column with black body backdrop, so the mobile frame is visible on desktop viewports
- [BottomNav] Centered to the 430px frame; hidden behind open sheets (sheets sit at `z-[60]`)

### Fixed
- [BottomSheet] Dialog accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape-to-close, body scroll lock (QA pass)
- [FilterSection] Added `role="group"` + `aria-label` (QA pass)
- [MatchCard / SelectChip] Arbitrary radii replaced with token classes (`rounded-card`, `rounded-full`)

---

## 2026-06-08

### Added
- `npm run optimize-images` script

### Changed
- [ProfileHero] Two-layer image and repositioned title/edit button to match Figma
- [BottomNav] Rebuilt as floating glassmorphic tabbar per Figma
- [ProfileMeta] Reordered to level/city/side; colon moved into label
- Profile typography aligned with Figma
- All auth/onboarding/profile images and icons localized from Figma CDN into `public/`; backgrounds optimized to WebP ≤1280px (~30MB → 1.4MB)

---

## 2026-06-07

### Added
- Profile section: `ProfileHero`, `ProfileAvatar`, `ProfileMeta`, `StatsGrid`, `StatCard`, `NavRow`, `PageHeader`, `SubPageLayout`, main `/profile` page and 5 sub-pages (edit, statistics, settings, support, rules)

---

## 2026-06-03

### Added
- Sign-up/login flow: `/login`, `/otp`, `/profile-setup`, `/assessment` pages
- Auth components: `AuthInput`, `OtpBox`, `OtpInput`, `RadioOption`, `RadioGroup`, `AuthActions`, `AuthCard`, `AuthSlide`
- [Tokens] Design token system in `app/globals.css` `@theme` (Tailwind v4) — colors, radii, blurs, font sizes; all auth/onboarding components refactored to token classes

### Changed
- [Button] Renamed from `OnboardingButton` and moved to shared `app/(auth)/_components/` (breaking)
- Auth pages made fluid: `w-full min-h-dvh` frames, responsive card width

### Fixed
- QA pass across auth components: all critical issues
- [RadioOption] Single dividers, correct selected state, circle on right
- Profile-setup labels: correct names, shown above input, Figma typography
- Blank pages; onboarding actions moved inside `StoryCard`

---

## 2026-06-02 — Initial build

### Added
- Onboarding flow (4 RTL Persian story slides): `ProgressBar`, `StoryCard`, `OnboardingActions`, `StorySlide`
- App scaffold: route groups `(auth)` / `(main)`, `BottomNav`, placeholder pages
- PWA mobile-first rules (390px viewport, 44px touch targets) in project conventions
