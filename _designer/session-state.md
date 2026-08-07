# Session State

## Session — 2026-08-07: role toggle, audit cleanup, doc catch-up
All merged to `main` and pushed to both remotes.
- **Step ۴ role toggle** (`feat/role-toggle-copy`): نقش شما went from `SelectField` + `OptionSheet`
  to an inline two-button `aria-pressed` pair (same chip idiom as the schedule step). Copy
  کاپیتان/یار → **برگزار کننده (مربی)** / **بازیکن** in the step, `TeamPreview`, and `StepReview`.
  This was the uncommitted work sitting in the tree at session start.
- **Audits closed to 0 open**: StepSchedule v2 — day `aria-label` (full jalali date) +
  `aria-current="date"`, past days via the `disabled:` modifier; arrow-key nav **accepted**
  (AvailabilityHeatmap precedent) and the memo suggestion **accepted** (31 items; its SSR-mismatch
  rationale is wrong — a `useState` seed still evaluates separately server/client).
  RadioCardGroup v3 — `aria-labelledby`/`aria-describedby` on the group; `className` passthrough
  accepted (feature composite, not a shared primitive).
- **Docs caught up**: CHANGELOG had nothing after 2026-07-29 — added 08-02, 08-03, 08-04, 08-05, 08-07.
  STATUS.md: wizard section still listed `AvailabilityHeatmap` + the old `monthId/dayId/daypart` data,
  and the API section still claimed a live `@username`; both corrected. TODO: photo-visibility item
  closed (feature removed), added the Web-OTP SMS-format and username-contract confirmations.

### Next
- Verify on device: calendar arrow direction, time range (۰۶:۰۰–۲۳:۳۰), duration set (deferred from 08-05).
- Still open: wire real APIs into `lib/data` accessors (matches/activity/notifications).

## Session — 2026-08-05: create-wizard rework + jalali timing step
Work on `main` (create-wizard commits) + branch `feat/jalali-timing-step` (merged `76427bf`).
- **Step 1 مشخصات**: match title optional (label اختیاری), description اختیاری; invite mode
  moved here from step 5 as a SelectField, public/private only.
- **Step 2 مکان**: locked استان/شهر → البرز/کرج (disabled SelectField); replaced with a
  reserved-court gate (no → InfoBanner + block; yes → searchable court picker + location +
  static map + مسیریابی); segmented بله/خیر toggle.
- **Step 3 زمان‌بندی (branch)**: full rewrite → quick chips + **jalali calendar** + time slots +
  duration. New `lib/jalali.ts` (inline conversion, no dep) + `lib/jalali.test.ts`. Draft model
  `monthId/dayId/daypart → date/time/duration`; removed AvailabilityHeatmap + wizardMonths +
  courtAvailability. All 3 fields required to advance.
- **Fixes**: wizard step-nav (jump back AND forward to any reached step); `/simplify` pass
  (dropped dead CourtOption.name + a StepChips guard).
- **ds-qa-tw on StepSchedule**: 0 Critical, 0 Warning, 4 Suggestions (arrow-key calendar nav,
  day aria-labels, disabled-modifier, memo). The initial "missing focus-visible rings" Warning
  was **withdrawn** — `globals.css:75` already applies a global `:focus-visible` brand outline
  app-wide. Audit-only, nothing changed.

### Next (resolved 2026-08-07 unless noted)
- ~~Merge `feat/jalali-timing-step`~~ — merged same day (`76427bf`); pushed 08-07.
- Verify on device: calendar arrow direction, time range (06:00–23:30), duration set. **Still open.**

## Session — 2026-08-03: profile/OTP polish + a11y regression check
- **Profile edit** — hero top-left edit button removed; both edit entry points (nav row) go straight to
  `/profile/edit/personal`; deleted the intermediate `/profile/edit` list page. Removed the public/private
  photo-visibility toggle + orphaned `updatePhotoVisibility` fn / `PhotoVisibility` type.
- **Profile menu** — logout moved to the profile page as the last row (icon-pill matching the nav rows,
  red glyph + chevron); تنظیمات nav row commented out (no settings flows yet).
- **Nav** — second tab icon reverted to the trophy `CupIcon` (label باشگاه‌ها + coming-soon unchanged).
- **OTP** — countdown relabeled from code-validity to resend cooldown; added a resend button at zero that
  re-requests the OTP and restarts the countdown from the new `nextResendAllowedAt`. `OtpInput` now accepts
  SMS autofill (`autocomplete="one-time-code"` + multi-digit spread; dropped `maxLength=1`).
  Backend TODO for programmatic Web OTP autofill: SMS last line `@<web-origin> #<code>` (Latin digits).
- **a11y audit (ds-qa-tw)** — AuthSearchSelect/AuthSelect were **already fully fixed in the 2026-07-22 v2
  refactor**; the TODO items were stale (now checked off). Regression clean. Added one new fix:
  AuthSearchSelect returns focus to its trigger on close (v3).

### Next
- Push today's commits to patchapp (via `sync/from-github` branch + MR — main is protected) and origin.
- Still stale/older: wire real APIs into `lib/data` accessors (matches/activity/notifications).

## Session — 2026-07-29: empty states, nav polish, copy pass
Seven branches merged → `main`, **pushed to origin** (`9ffa6f2`). All branches deleted.

- **Copy pass** (`chore/copy-update-mach`): rewrote onboarding slides (+ بزن بریم CTA), login button →
  ادامه, OTP title تایید شماره / button تایید, profile-setup welcome copy, assessment Q1/Q2 wording.
  Global term change **مسابقه → مَچ** (مسابقات/مسابقه‌ها → مَچ‌ها, مسابقه‌ای → مَچی) across ~15 files via
  ordered `perl -CSD -Mutf8` passes (needed `-Mutf8` or the Persian literals matched as bytes, not chars).
  Used مَچ everywhere, not the offered پَچ‌میک/پَچ‌میکینگ — noted user can swap specific brand spots.
  Onboarding slide 4 split into title/description to fit the card. تورنومنت left untouched.
- **Empty states** — mock-data lists now render an empty state instead of nothing on a fresh start.
  `EmptyMatches` (icon + message + ساخت مَچ CTA → /matches/create) and `EmptyActivity` (icon + message,
  no CTA), both guarded on `!isLoading`. **Emptied the mock** `matchList` and `activitySections` (samples in
  git history) so the states show now; removed orphaned mock helpers `squad`/`AVATAR` (matches) and
  `COURT_THUMB` (activity). Reused exported `MatchesIcon`/`DiscoverIcon` from BottomNav
  (`feat/matches-empty-state`, `feat/activity-empty-state`).
- **Nav dots data-driven** (`feat/nav-notification-dots`): new `getUnreadCounts()` accessor (`lib/data`
  seam, `{}` today) drives the red dot per route; removed the hardcoded `badge:true` flags. No dots until a
  notifications backend exists; swap the accessor body + invalidate `["unread-counts"]` when it does.
- **Clubs tab hint** (`feat/clubs-tab-hint`): tapping the disabled clubs tab flashes a به زودی bubble
  (auto-hide 1.8s, keyed by href). Dropped the pill's `overflow-hidden` so it can sit above the bar.
- **Post-auth → create wizard** (`chore/post-auth-to-create`): `POST_AUTH_ROUTE` = `/matches/create`.
  NOTE: this fires for returning already-authed users too, not just new signups — flagged to user.
- **ponytail-audit** of the logic layer (`lib/api`, `lib/data`, hooks): came back lean — one cut,
  the dead `ProfilePhotoVisibilityRequest` type, removed (`chore/rm-dead-type`).

### Next
- Wire real APIs into the `lib/data` accessors (matches/activity/notifications) — each swaps its mock body
  for a `fetch` + a `to<ViewModel>` mapper; UI, query keys, and empty states don't change.

## Session — 2026-07-28: auth routing, OTP countdown, dev-disk fix
Four small branches merged → `main` and **pushed to origin** (`fcf1327`): `chore/skip-assessment-redirect`
(`9516603`), `feat/otp-countdown` (`0d551aa`), `feat/profile-status-guard` (`cd7f895`),
`feat/post-auth-route` (`7073ea3`). All branches deleted.

- **profileStatus route guard** — `AuthGuard`/`useRequireAuth` now fetch `/players/me` and redirect to
  `/profile-setup` when `profileStatus !== "complete"`. `/profile-setup` is in the `(auth)` group (not
  guarded) so no redirect loop. An errored/absent `/me` lets the user through (no stuck spinner on the
  flaky backend). OTP-verify routes by the same field; profile-setup `setQueryData(["me"], updated)` on
  success so the guard sees "complete" without a refetch. Consolidated the duplicated `["me"]` query
  options + "complete" check into `meQuery` / `isProfileComplete` (`lib/api/useAuth.ts`).
- **Post-auth landing → `/matches`** (home `/` is empty for now). Extracted to `POST_AUTH_ROUTE`
  (`lib/routes.ts`), used by OTP-verify, profile-setup, assessment-finish, and the already-authed
  redirect — one source of truth instead of 4 scattered literals. BottomNav's home tab still points at `/`
  (left alone).
- **OTP validity countdown** on `/otp` — login forwards `nextResendAllowedAt` as an `expires` param; page
  ticks a `secondsLeft` interval, shows `mm:ss` in Persian digits (`text-white/80` for contrast on the
  glass card), → "اعتبار کد به پایان رسید" at zero. NOTE: the field is really a *resend cooldown*; shown
  as validity per request — revisit if a resend button is added.
- **Skip assessment** — profile-setup no longer redirects to `/assessment` (deferred); assessment
  page/route kept intact with a `TODO` to restore.
- **Add-menu (BottomNav +)** reordered → ساخت مسابقه · رزرو زمین · ساخت تورنومنت. Only create-match
  navigates; رزرو زمین + ساخت تورنومنت are non-navigating "به زودی" rows (`aria-disabled`, dimmed, the
  `NavRow` coming-soon pattern). Added `comingSoon?` to the `AddAction` type (`feat/add-menu-order-comingsoon`,
  merged `b11fdc1`).
- **Bottom-nav 2nd tab → باشگاه‌ها** (`/clubs`), coming-soon: new stroke `ClubsIcon` (clubhouse), renders
  as a non-navigating `<span>` (icon at 40% opacity, `aria-disabled`, `aria-label="باشگاه‌ها (به زودی)"`).
  Tournaments removed from the nav; orphaned `CupIcon` deleted (`feat/nav-clubs-tab`, merged `786ec65`,
  pushed origin).
- **Dev-env (not committed):** `.next` was on the HDD (`/home` = `sda`, rotational) → "Slow filesystem"
  warning. Now a **bind mount** of `/var/tmp/patch-next` (NVMe) onto the in-project `.next` path, persisted
  in `/etc/fstab`. A plain symlink was tried first but broke Turbopack module resolution (`@tailwindcss/postcss`
  not found — Node resolved from the out-of-tree realpath); the bind mount keeps the in-project path so
  resolution works. Ready-in dropped ~2.1s → ~250ms.

## Session — 2026-07-22: profile-setup location/username + mobile fixes
Merged `feat/token-refresh` → `main` (`3eb84ad`, 8 commits, pushed origin + patchapp; branch deleted).

- **Profile-setup** now sends all API-required fields. New `lib/api/geo.ts` (`getProvinces`/`getCities`);
  province→city is a **full-screen searchable picker** `AuthSearchSelect` (portal + top-pinned search so
  the mobile keyboard doesn't resize it — bottom-sheet resized on typing, rejected). Gender = inline
  dropdown `AuthSelect` (native `<select>` was tried for mobile reliability, then reverted to inline per
  user). New username field (`^[a-zA-Z0-9_]{3,20}$`); names ≤20 Persian-only; submit-guard + re-filter.
- **Live `@username`** on `/profile`. `PlayerResponse`/`UpdateProfileRequest` types updated (+username,
  residenceCityId; +Province/City). Photo **public/private toggle** (write-only — `/players/me` has no
  visibility field yet).
- **Mobile root-cause found:** the phone (192.168.1.44) wasn't in `allowedDevOrigins` (only .36), so Next
  **blocked its dev JS** — that (not the code) was breaking mobile input filters + dropdowns. Adding the IP
  fixed the cascade. Also hardened `AuthInput` Persian-only for Android/Gboard composition (`compositionend`
  + imperative DOM reset). NOTE: dev tools puppeteer-core is `--no-save` in node_modules (not committed).
- **Token refresh** (from 2026-07-21, same branch): `/auth/refresh` rotation in `lib/api/client.ts`.

- **API/auth code review** (`/code-review`, high, over `4b5c5b6..HEAD` API surface): 6 findings, top 4
  fixed on `fix/api-review` (merged `f823e27`) — 401 no longer over-logs-out (only genuine
  expiry ends the session), OTP-verify getMe failure → `/profile-setup` fallback, typed
  `updatePhotoVisibility`, fixed JSDoc. Skipped (low): fetchQuery staleness after account switch,
  `retry:1` double-getMe — both logged in TODO.md.

- **Component QA** (`ds-qa-tw`, audit mode) on the new auth/profile components: 0 Critical, 3 Warning,
  ~5 Suggestion. Warnings = AuthSearchSelect modal needs dialog semantics + focus trap; AuthSelect/
  AuthSearchSelect option lists not keyboard-navigable (Tab+Enter works). Audit files written
  (AuthSelect, AuthSearchSelect, AuthInput v3, LogoutRow, NavRow, auth-profile-misc); index + TODO
  updated. No refactor applied (audit only).

### Next
- Assessment persistence + photo-visibility read side await backend fields (TODO.md). Consider a shared
  BottomSheet/portal picker if more searchable selects appear.
- Optional: refactor the ds-qa-tw Warnings (dropdown a11y) — dialog semantics + focus trap + keyboard nav.


---

Older sessions (2026-07-21 and earlier) are in [`session-state-archive.md`](./session-state-archive.md).
