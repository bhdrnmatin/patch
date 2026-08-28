# Component Status

## Onboarding Flow

### Base Components
- [x] `Button` — `app/(auth)/_components/Button.tsx`
- [x] `ProgressBar` — `app/(auth)/onboarding/_components/ProgressBar.tsx`
- [x] `StoryCard` — `app/(auth)/onboarding/_components/StoryCard.tsx`

### Compound Components
- [x] `OnboardingActions` — `app/(auth)/onboarding/_components/OnboardingActions.tsx`

### Layout Components
- [x] `StorySlide` — `app/(auth)/onboarding/_components/StorySlide.tsx`

### Pages
- [x] `OnboardingPage` — `app/(auth)/onboarding/page.tsx`

### Infrastructure
- [x] Yekan Bakh font (local OTF, 400/700) — `app/fonts/` + `app/layout.tsx` + `app/globals.css`

---

## Sign-Up / Login Flow

### Base Components
- [x] `AuthInput` — `app/(auth)/_components/AuthInput.tsx`
- [x] `OtpBox` — `app/(auth)/_components/OtpBox.tsx`
- [x] `RadioOption` — `app/(auth)/_components/RadioOption.tsx`

### Compound Components
- [x] `OtpInput` — `app/(auth)/_components/OtpInput.tsx`
- [x] `RadioGroup` — `app/(auth)/_components/RadioGroup.tsx`
- [x] `AuthActions` — `app/(auth)/_components/AuthActions.tsx`

### Layout Components
- [x] `AuthCard` — `app/(auth)/_components/AuthCard.tsx`
- [x] `AuthSlide` — `app/(auth)/_components/AuthSlide.tsx`

### Pages
- [x] `LoginPage` — `app/(auth)/login/page.tsx`
- [x] `OtpPage` — `app/(auth)/otp/page.tsx`
- [x] `ProfileSetupPage` — `app/(auth)/profile-setup/page.tsx`
- [x] `AssessmentPage` — `app/(auth)/assessment/page.tsx`

---

---

## Design Token System

- [x] Tokens defined in `app/globals.css` `@theme` block (Tailwind v4)
- [x] All auth components refactored — no hardcoded hex or arbitrary design values
- [x] All onboarding components refactored
- [x] Token reference table in `CLAUDE.md`

---

---

## Profile Section

### Base Components
- [x] `PageHeader` — `app/profile/_components/PageHeader.tsx`
- [x] `StatCard` — `app/profile/_components/StatCard.tsx`
- [x] `NavRow` — `app/profile/_components/NavRow.tsx`

### Compound Components
- [x] `StatsGrid` — `app/profile/_components/StatsGrid.tsx`
- [x] `ProfileMeta` — `app/profile/_components/ProfileMeta.tsx`
- [x] `ProfileAvatar` — `app/profile/_components/ProfileAvatar.tsx`

### Layout Components
- [x] `ProfileHero` — `app/profile/_components/ProfileHero.tsx`
- [x] `SubPageLayout` — `app/profile/_components/SubPageLayout.tsx`

### Pages
- [x] `ProfilePage` — `app/profile/page.tsx`
- [x] `EditProfilePage` — `app/profile/edit/page.tsx`
- [x] `StatisticsPage` — `app/profile/statistics/page.tsx`
- [x] `SettingsPage` — `app/profile/settings/page.tsx`
- [x] `SupportPage` — `app/profile/support/page.tsx`
- [x] `RulesPage` — `app/profile/rules/page.tsx`

---

## Matches Flow

Figma: Match page + Sort sheet + Filter sheet → route `/matches` with two modal states.
All components live in `app/(main)/matches/_components/` unless noted.

### Base Components
- [x] `icons` — inline Matches icon set (filter-search, sort, calendar, chart, people, close, info)
- [x] `IconButton` — circular glassmorphic header button
- [x] `DateCell` — single day cell (selected / default / past states)
- [x] `StatusBadge` — match status pill (جاری / برگزار شده / برگزار نشده)
- [x] `PlayerSlot` — avatar + name + level
- [x] `MetaItem` — icon + label (avg level / players / date)
- [x] `PriceTag` — amount + تومان in Persian digits
- [x] `SelectChip` — selectable pill for sheets (selected / unselected)

### Compound Components
- [x] `DateSelector` — horizontal scroll row of `DateCell`
- [x] `MatchCard` — full match card (badge + title + player grid + meta + price)
- [x] `MatchesHeader` — hero header (bg + title + 2 `IconButton` + `DateSelector`)
- [x] Collapsing hero — `lib/useCollapseHeader.ts` writes `--collapse` (0→1) onto the header on scroll
      and the `.hero-collapse*` rules in `globals.css` shrink every part (title, buttons, date strip,
      photo, profile avatar). Used by `SportPageHeader` and `ProfileHero`; both are `fixed` with a
      same-height spacer so the page never reflows
- [x] `FilterSection` — labeled group of `SelectChip`
- [x] `BottomSheet` — modal shell (overlay + sheet + header + footer)

### Layout Components
- [x] `SortSheet` — `BottomSheet` + sort `FilterSection`s + footer
- [x] `FilterSheet` — `BottomSheet` + filter `FilterSection`s + footer

### Pages
- [x] `MatchesPage` — `app/(main)/matches/page.tsx`

### Data
- [x] `MatchListItem` / `MatchStatus` types — `lib/types.ts`
- [x] Mock matches + dates — `lib/mock/index.ts`

### Reused (not rebuilt)
- `BottomNav` (via `(main)/layout.tsx`), `Button` (auth pill, sheet footers), `toPersianDigits`.

---

## Match Details Flow

Figma: 6 frames — creator × (not-started / started / finished): 20206-6873, 20323-6512,
20323-6971; player × same states: 20323-8354, 20325-30092, 20325-32702.
One route `/matches/[id]`; sections toggle/reorder by `role` × `status`
(demo via `?role=creator|player&status=upcoming|live|finished`).
Components live in `app/matches/[id]/_components/` — outside `(main)` so the
BottomNav doesn't render; the page has its own sticky CTA bar instead.

### Base Components
- [x] `ActionPill` — glass icon+label pill (اشتراک گذاری / ویرایش on hero)
- [x] `SectionCard` — white rounded card shell with icon-circle + title header
- [x] `InfoItem` — icon + label + value row (اطلاعات grid)
- [x] `InfoBanner` — blue rounded notice with (i) icon
- [x] `StageDial` — circular stage progress (مرحله ۱/۳)
- [x] `PlayerChip` — white card: avatar + name + لول (new; `PlayerSlot` is the gray list-card variant)
- [x] `FaqItem` — accordion row (question + chevron, expands)

### Compound Components
- [x] `MatchStageCard` — status pill + next-step text + `StageDial`
- [x] `MatchInfoCard` — `SectionCard` اطلاعات + 2-col `InfoItem` grid (6 items)
- [x] `ScheduleCard` — big date, deadline, time range, اضافه به تقویم button
- [x] `DescriptionCard` — `SectionCard` توضیحات + body text
- [x] `PlayersSection` — بازیکنان header + همه link + `PlayerChip` grid + team `InfoBanner`
- [x] `PromoCard` — رنک پلیر ماه promo with athlete image
- [x] `CourtCard` — اطلاعات زمین: club name, `InfoBanner`, map image, مسیریابی button
- [x] `ShareCard` — به اشتراک گذاری row + محدودیت ورود meta
- [x] `FaqSection` — سوالات متداول + `FaqItem` list
- [x] `JoinRequestRow` — player row + قبول/رد buttons (creator only)
- [x] `JoinRequestsSection` — درخواست‌های ورود header + rows
- [x] `MatchCtaBar` — sticky bottom CTA button + optional caption (player variants)

### Layout Components
- [x] `MatchDetailsHeader` — hero: bg image, back `IconButton`, title, `ActionPill`s

### Pages
- [x] `MatchDetailsPage` — `app/matches/[id]/page.tsx` — composes by role × status

### Data
- [x] `MatchDetails` / `JoinRequest` / `FaqEntry` types — `lib/types.ts`
- [x] Mock match details + FAQ + requests — `lib/mock/index.ts`

### Reused (not rebuilt)
- `IconButton` (back button), `InfoIcon`/`CalendarIcon`/`CloseIcon`/`TomanIcon`
  (matches icon set), `WhistleIcon`/`CourtIcon`/`MatchesIcon` (exported from
  `BottomNav`), `toPersianDigits`, avatar placeholder.

## Results Entry Flow

Figma: none — designed from the system + user decisions (multi-set 2v2 games, inline cards,
score steppers). Route `/matches/[id]/results`, reached from the live-match creator CTA
("وارد کردن نتیجه"). Components live in `app/matches/[id]/results/_components/`.

### Base Components
- [x] `ScoreStepper` — −/value/+ per team per set, `aria-live` value announcements
- [x] `PlayerSlotButton` — filled player chip / dashed empty slot; `slotLabel` a11y context

### Compound Components
- [x] `GameCard` — بازی N: two team columns × 2 player slots + set list + افزودن ست
- [x] `PlayerPickerSheet` — `BottomSheet` + match players; used players disabled, tap current = clear slot

### Pages
- [x] `MatchResultsPage` — `app/matches/[id]/results/page.tsx` — client-side `GameEntry[]` state, add/remove games

### Data
- [x] `GameEntry` / `TeamSlots` / `SetScores` types — exported from `GameCard.tsx` (client state; players are indexes into `matchDetails.players` until the API defines ids)
- [x] `matchDetails.players` mock — 6 distinct names/levels (was 6 identical clones)

### Reused (not rebuilt)
- `SubPageLayout` (profile), `MatchCtaBar`, `BottomSheet`, shared icons, `toPersianDigits`.

### Removed
- `ResultSheet` — the filter-chip placeholder sheet; the live-creator CTA now navigates to this page instead.

---

## Create Match Wizard

Figma: two WIREFRAMES only (19946-34262 long form, 19946-34346 review) — styled from the design
system, not the wireframe. Route `/matches/create` (no BottomNav), reached from the AddMenu's
"ساخت مسابقه". 6 steps: مشخصات → مکان → زمان‌بندی → بازیکنان → تنظیمات → اتمام.
Components live in `app/matches/create/_components/`.

### Base Components (first light-theme form primitives)
- [x] `TextField` — light single-line input, `numeric?` → Persian digits
- [x] `TextArea` — light multiline input
- [x] `SelectField` — select trigger (chevron + value), `aria-haspopup="dialog"`, opens a sheet
- [x] `OptionSheet` — generic pick-one list in `BottomSheet`; opt-in `searchable`
- [x] `RadioCardGroup` — icon/title/description radio cards (`aria-pressed` toggles) — steps ۱، ۴ و ۵
      (step ۵ = نحوه ورود بازیکنان, shown only when the match is عمومی)
- [x] `AddPlayerSheet` — how a teammate row gets filled: pick from Patch players, or invite a phone
      number (۱۱ digits, `09…`). Menu + phone field in one sheet; also removes a filled row
- [x] `RadioCardGroup` also carries step ۵ (نحوه ورود بازیکنان) — see the Removed section

### Compound Components
- [x] `WizardHeader` — × close + title/step subtitle + `StageDial` ring
- [x] `StepChips` — RTL step strip; jumps back and forward to any reached step
- [x] `WizardFooter` — fixed قبلی/بعدی bar, gated advance, `aria-busy` submit
- [x] `TeamPreview` — 2×2 team grid with "تور" divider; رقابتی only (the other formats have no
      fixed team shape)
- [x] `ReviewPlayers` — اعضا list with برگزار کننده/یار/دعوت‌شده role tags
- [x] `StepDetails` / `StepLocation` / `StepSchedule` / `StepPlayers` / `StepReview`

### Removed
- `ToggleSetting` (component + the `ToggleSetting<T>` type) and the four step-۵ settings it rendered —
  حداقل/حداکثر سطح, ترجیح جنسیتی, هزینه ورودی — **removed 2026-08-12** (user decision). `createMatch`
  therefore writes `price: 0` for every match. In git history if the fields come back.
- `StepSettings` and the whole **step ۵ تنظیمات** — **removed 2026-08-20** (user decision: unused).
  The join method it asked (`draft.joinMethod`) had no consumer, so the field went with it and the
  wizard is 5 steps. `invite` (نمایش مسابقه) is unaffected — it's asked in step ۱.
- `AvailabilityHeatmap` (+ `wizardMonths` / `courtAvailability` mocks) — replaced by the jalali
  calendar in the 2026-08-05 timing rework.

### Pages
- [x] `CreateMatchPage` — `app/matches/create/page.tsx` — `CreateMatchDraft` state + per-step validation + `createMatch` mutation (redirects to the new match as creator)

### Data
- [x] `CreateMatchDraft` / `CourtOption` / `Teammate` / `MAX_TEAMMATES` — `lib/types.ts`
      (schedule fields are `date` ISO / `time` HH:MM / `duration` minutes)
- [x] Roster model: `teammates: Teammate[]` — each is `{kind:"player", index}` (into `pickablePlayers`)
      or `{kind:"invite", phone}`. رقابتی caps it at `MAX_TEAMMATES` (۳ + the creator); دوستانه and
      آمریکانو are uncapped. `coach` is an index into that list, only set when `myRole === "player"`
- [x] `courtOptions` / `pickablePlayers` mocks + accessors
- [x] `lib/jalali.ts` — dependency-free jalali↔gregorian conversion + month/weekday names,
      self-checked by `lib/jalali.test.ts`
- [x] `createMatch` mutation — `lib/data/mutations.ts` (unshifts into `matchList`, returns id)

### Reused (not rebuilt)
- `StageDial`, `BottomSheet`, `SelectChip`/`FilterSection`, `PlayerPickerSheet`, `DateSelector`/`DateCell`,
  `DescriptionCard`/`ScheduleCard`/`CourtCard`/`InfoBanner` (review step), icons, `toPersianDigits`.

### Shared components extended (backward compatible)
- `ScheduleCard` — `deadline?` now optional
- `DateCell`/`DateSelector` — `tone="light"` variant for bg-surface pages

---

## API Integration (auth + profile + clubs)

Branch `feat/api-auth-profile`. Wires the auth/profile flows to `api.patchapp.ir`, plus
the court picker's club list (2026-08-25); every other feature stays on the mock `lib/data`
seam. The API sends no CORS headers → `next.config.ts` proxies same-origin `/api/v1/*` to
the upstream. What the deployed API actually does — as opposed to what its spec claims —
is recorded in [`_designer/api-findings.md`](_designer/api-findings.md).

### Infrastructure — `lib/api/`
- [x] `config` / `session` (localStorage bearer, SSR-guarded, reactive) / `client` (`apiFetch`, `ApiError`, 401 handling)
- [x] `types` (API DTOs) / `auth` (requestOtp/verifyOtp/logout) / `players` (getMe + profile updates)
- [x] `useAuth` hook + `useRequireAuth`/`useRedirectIfAuthed`; `AuthGuard` — `app/_components/AuthGuard.tsx`
- [x] `toLatinDigits` — `lib/persian.ts`; proxy rewrite — `next.config.ts`; `.env.example`
- [x] `clubs` (`listClubs`, ACTIVE-filtered) — feeds the wizard's court picker via `lib/data/matches.ts`
- [x] Error boundary — `app/error.tsx` (one at the app segment; every `useSuspenseQuery` read path is covered)
- [x] `scripts/api.sh` — authenticated curl against the live API (OTP login → verify → admin login,
      bearer attached, auto-refresh). Session in `.api-session.json`, **gitignored — real refresh token**

### Wired flows
- [x] Login (request OTP), OTP (verify → tokens → route by profile completeness)
- [x] Profile-setup (`PUT` name+gender+city, then `preferredSide` to `/players/me/display-info`; Persian-only inputs; assessment deferred)
- [x] Edit profile → `/profile/edit/personal`: name, preferred side, residence cascade, bio + photo upload (`uploadProfilePhoto`); sticky save bar; email/password rows hidden
- [x] `/profile`: live avatar (`ProfileAvatarLive`, silhouette fallback), bio (`ProfileIdentity`), preferred-side chip (`ProfileMeta`)
- [x] Logout row on `/profile` → `POST /auth/logout`; settings row hidden until settings flows exist
- [x] Route guards: `(main)`, `/profile`, `/matches/*` layouts; login/otp redirect when authed
- [x] Create wizard step ۲: court picker lists real clubs (`ClubResponse` → `CourtOption`), so the
      `clubId` it produces is one the API recognises — the first wizard step that can submit

### Status
- tsc + lint clean; all routes 200; same-origin proxy verified forwarding to upstream.
- `dev` pinned to `-p 3000` (stable origin so the localStorage token survives restarts).
- [x] **Token refresh (2026-07-21):** `POST /auth/refresh` is wired in `lib/api/client.ts` — proactive
  refresh of an expired token + reactive refresh-and-replay on 401, single-flight, rotating. Sessions
  now survive the 15-min access-token TTL; only a dead refresh token logs the user out.
- [x] **Profile-setup complete (2026-07-22):** sends all required fields incl. `residenceCityId`
  (searchable province→city picker `AuthSearchSelect`; gender inline `AuthSelect`); names ≤20
  Persian-only. Mobile: Persian-input hardened (compositionend), `allowedDevOrigins` + phone IP.
- [x] **Preferred side replaced username (2026-08-03):** the backend is dropping `username`, so
  profile-setup and `/profile` carry `preferredSide` (`RIGHT`/`LEFT`) via `/players/me/display-info`
  instead. The photo public/private toggle was removed (write-only, no read side on `/players/me`).
- [x] **OTP resend + SMS autofill (2026-08-03/04):** resend button at cooldown zero; `autocomplete="one-time-code"`
  + multi-digit paste; Web OTP API wired for Android. Backend still owes the SMS `@<origin> #<code>` last line.
- [x] **A rejected token ends the session (2026-08-28):** `apiFetch` used to log out only when `exp`
  had passed locally, so a rotated signing key left dead tokens looking valid and the 401 dead-ended on
  the error screen. After the one refresh-and-replay chance, a 401 now clears the session (this API uses
  403 for authorization). Covered by `lib/api/client.test.ts` — `npx tsx lib/api/client.test.ts`.
- [ ] **`POST /matches` is not wired yet** — step ۲ produces a valid `clubId` and 08-27 brought
  field-level errors (`loc: "format"`, `loc: "clubId"`), so submit is buildable. One backend gap to
  work around: a missing `title` 500s. See TODO.md.
- [ ] **Invitations are invisible after save** — no organizer-side invitation list, and an invite stays
  out of `participants` until accepted; the design has no pending state either. No player lookup
  endpoint, so the wizard's add-a-Patch-player flow has nothing behind it.
- (`/otp/request`'s earlier 500 now appears resolved — login completes end-to-end.) See TODO.md.

---

## Patterns

| Pattern | Status | Spec | Implementation |
|---|---|---|---|
| AddMenu (plus-button speed dial) | ✅ Done | `patterns/AddMenu.spec.md` | `app/(main)/_components/BottomNav.tsx` |

---

## Notes
- All assets are local now — no Figma CDN URLs in code. Images in `public/images/`, icons in `public/icons/`.
- Background images optimized: WebP, resized to ≤1280px, q80 (~30MB PNG → 1.4MB total).
- Post-onboarding destination: `/` (main app discover page).
- All pages render as a centered `max-w-[430px]` column on a black backdrop (desktop-safe).

## Open items
See [TODO.md](TODO.md) — token gaps from the Matches audit and sort/filter behavior wiring.
Change history in [CHANGELOG.md](CHANGELOG.md).
