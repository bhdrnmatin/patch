# Component Status

## Onboarding Flow — PARKED (2026-09-12)

**Out of the product, not deleted.** The folder is `app/(auth)/_onboarding/` — the leading
`_` makes it a Next private folder, so none of it routes, but it still compiles and
type-checks and can be revived by renaming the folder back. Nothing in the app linked to
it, so no other flow changed. Art directions: `feat/onboarding-drawn-art` and
`feat/onboarding-generated`; the violet renders are the ones parked here.

### Base Components
- [x] `Button` — `app/(auth)/_components/Button.tsx`
- [x] `ProgressBar` — `app/(auth)/_onboarding/_components/ProgressBar.tsx`
- [x] `StoryCard` — `app/(auth)/_onboarding/_components/StoryCard.tsx`

### Compound Components
- [x] `OnboardingActions` — `app/(auth)/_onboarding/_components/OnboardingActions.tsx`

### Layout Components
- [x] `StorySlide` — `app/(auth)/_onboarding/_components/StorySlide.tsx`

### Pages
- [x] `OnboardingPage` — `app/(auth)/_onboarding/page.tsx` (not routed)

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

## API Integration (auth + profile + clubs + matches list)

Wires the auth/profile flows to `api.patchapp.ir`, plus the court picker's club list
(2026-08-25) and the matches list (2026-09-13); every other feature stays on the mock
`lib/data` seam. **Read the blockers below before picking up create-match** — the mapping
is finished and deliberately unwired. The API sends no CORS headers → `next.config.ts`
proxies same-origin `/api/v1/*` to the upstream. What the deployed API actually does — as
opposed to what its spec claims — is recorded in
[`_designer/api-findings.md`](_designer/api-findings.md).

### Create-match drafts
- [x] `lib/draft.ts` — one half-finished wizard in localStorage (autosaved on every change; a draft
      whose day has passed is dropped). `ResumeDraftBar` offers ادامه / شروع دوباره on step ۱.
      No on-exit prompt: the App Router can't intercept the hardware back, a nav tap or the edge
      swipe, so it would catch one exit in four. Test: `npx tsx lib/draft.test.ts`

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
- [x] **Matches list is live (2026-09-13):** `getMatchList` calls `GET /matches` and maps
  `MatchResponse` → `MatchListItem` (`lib/data/matches.ts`, tested by `lib/data/matches.test.ts`).
  Verified in WebKit against real matches. Three card fields have no API source until after the MVP —
  per-player `level`, the `avgLevel` average, and `price` — so they are optional and the card drops
  the element rather than showing «لول ۰» or a free-entry tag. The card's CTA is now a real
  `Link` to `/matches/{id}`; it had been a `<button>` with no handler, so the list had no route
  into a match at all.
- [ ] **`POST /matches` — mapping written and tested, deliberately NOT wired (2026-09-12).**
  `lib/api/matches.ts` (`draftToCreateRequest` + `createMatch`) and `lib/api/matches.test.ts` are
  done; `lib/data/mutations.ts` still writes to the mock. **Blocked on one backend bug:**
  `scheduledAt` is a `java.time.Instant` and the "exactly on the hour" rule is checked against **UTC**
  minutes, while Iran is UTC+03:30 — so Tehran ۱۸:۰۰ (`18:00+03:30` = 14:30Z) is rejected and only
  half-past-Tehran times are accepted. Every slot the wizard offers fails, so flipping it today would
  break the wizard for every user. **The mapping needs no change when the server validates in
  `Asia/Tehran`** — it already sends the offset. Re-probed and still broken 2026-09-13.
  Evidence: `_designer/api-findings.md` §0.
- [ ] **رقابتی is disabled in the UI (2026-09-12)** — `matchType: COMPETITIVE` returns 400
  «مسابقات رقابتی هنوز فعال نشده‌اند», matching the spec's *Only FRIENDLY is accepted in this MVP*.
  Greyed out with a «به‌زودی» pill behind `COMPETITIVE_ENABLED` in `StepDetails.tsx` — one flag to
  flip. The 2v2 team preview, `MAX_TEAMMATES` and the capacity rule are untouched and ready.
- [ ] **A missing `title` still 500s** (open since 2026-08-24) — worked around: step ۱ now *requires*
  a title (user decision), and the mapping keeps a generated fallback for drafts saved before that.
  `capacity` is required with a minimum of 4 while دوستانه/آمریکانو are uncapped by design, so the
  mapping floors the roster at 4.
- [ ] **Invitations are invisible after save** — no organizer-side invitation list, and an invite stays
  out of `participants` until accepted; the design has no pending state either. Phone invites dropped
  the name field on 2026-09-12 (the number is the identity). `GET /matches/invitations/suggestions`
  exists and returns `{accountId, firstName, lastName, photoUrl}` — likely the source for
  «از بین بازیکنان پچ», which is meant to list people you have played with rather than every account;
  `getPickablePlayers` is still the mock.
- [x] **Match details is live (2026-09-14):** `getMatchDetails` calls `GET /matches/{id}` and
  resolves `clubId` against the cached clubs list for the club name and the coordinates `CourtMap`
  needs — no extra round trip. Format maps to a Persian label, and `timeRange` converts the stored
  UTC instant to Tehran (`+03:30`), so a match created at ۱۷:۳۰ reads back as ۱۷:۳۰. Six fields have
  no API source and their cards omit themselves: `fee`, `deadline`, `restriction`, `courtNote`,
  `teamNote`, `faq`.
- [x] **Join requests are live (2026-09-14):** the participant status values were learned by
  experiment — a second account joining a `MANUAL_APPROVE` match produces
  `status: "REQUESTED"`, `joinChannel: "REQUEST"`, against the organizer's `CONFIRMED`/`OPEN`.
  `filled` counts confirmed, `requests` are the requested rows keyed by **participant** id, and
  `respondToJoinRequest` posts to `/participants/{id}/approve|reject`. `JoinRequest.level` and
  `.side` have no API source, so that meta line omits itself. Both enums are still undeclared in
  the spec — see api-findings §0d. **Approve confirmed on a device 2026-09-14:** the row clears,
  the player joins the roster and شرکت کنندگان increments. Reject is still untried.
  Also confirmed on device: the court map renders from the club's real coordinates, the list
  card's «مشاهده مچ» reaches the details page, and the auth keyboard flows still behave.
- [x] **Viewer role and stage are derived (2026-09-14):** the details page no longer reads
  `?role=`/`?status=` from the URL in production. Role compares
  `MatchResponse.organizer.accountId` with the JWT `sub` (`getAccountId()` — note this is an
  *account* id, not `PlayerResponse.id`); stage comes off the clock. Verified with two accounts:
  the organizer gets ویرایش + «لغو مَچ», a non-organizer gets «لغو ارسال درخواست ورود».
- [ ] **Not yet wired, all available today:** `POST /matches/{id}/join`,
  `DELETE /matches/{id}/participants/me`, the approve/reject actions, and the invite-token flow.
- [ ] **No endpoint exists at all for:** tournaments, activity, notification counts. Those stay on
  mocks regardless of anything above.
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
- All pages render as a centered `max-w-[430px]` column on a black backdrop (desktop-safe).

## Open items
See [TODO.md](TODO.md) — token gaps from the Matches audit and sort/filter behavior wiring.
Change history in [CHANGELOG.md](CHANGELOG.md).
