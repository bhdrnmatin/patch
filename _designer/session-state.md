# Session State

## Session — 2026-08-31: the root URL, the iPhone keyboard, and the collapsing heroes
On `main`. Three commits, **not pushed** (both remotes are at `b12b8ab`). **An iPhone finally
entered the loop**, which is what moved the keyboard fix from unverified to fixed.

- **`/` redirects to `/matches`** (`05ae502`) — nothing had linked to the discover placeholder since
  BottomNav's tabs became /matches, /clubs, /activity, /profile, but the bare origin and the
  installed PWA (`start_url: "/"`) both still landed on it. In `next.config`, not the page: under
  streaming a page-level `redirect()` travels inside the RSC payload, so the browser paints the empty
  shell first. `redirects()` is a 307 before anything renders.
- **The auth keyboard fix, now verified** (`6eec6bc`) — `AppScroll` was sized to `--vvh` but every
  auth frame inside it was still `dvh`, the layout viewport iOS never shrinks for the keyboard. An
  844px frame in a ~430px box with `overflow-hidden`, so the card wasn't below the fold, it was
  unreachable. Frames read `--vvh` now, with `min-h` so a tall card grows and scrolls instead of
  clipping. Onboarding deliberately keeps `h-dvh` — `StorySlide` has no intrinsic height and rendered
  black against a non-definite parent. Completes `ac70a4b`.
- **Every hero collapses** — `.hero-page` guarantees the 204px of scroll the collapse needs, so an
  empty `/matches` behaves like a full `/tournaments`. `ProfileHero` is a collapsing header now too;
  `.hero-collapse-avatar` fades out the avatar that straddles its bottom edge.

### Two traps that cost most of the session
- **Deleting a route file while `next dev` runs poisons Turbopack's cache.** Every HMR check panicked
  (`Failed to write app endpoint /(main)/page`) and the overlay reloaded, so every route in the group
  looked like an app-level redirect loop. I spent a long time in the auth guard before asking for the
  terminal output, which named it immediately. **When the dev server is in play, read its log first.**
- **The `globals.css` stale-CSS miss is real and repeated.** `.hero-collapse` was in the served chunk
  and `.hero-page` was not, with the rule on disk. Only a restart with a cleared `.next` fixed it.

### Next
- **Push the three commits to both remotes.**
- **Verify the collapse on a signed-in device.** /matches, /activity and /profile are behind
  `AuthGuard`, so headless only ever sees the spinner — none of the collapse work is visually
  confirmed. `/profile` especially: its hero is fixed now, so content scrolls under it, and the
  avatar fade is a design call I made rather than one you chose.
- **The old iPad (iOS 12.5.7) can never run this app** — Safari 12 has no `@layer`, so it drops every
  Tailwind v4 utility, and no `visualViewport`, so it can't test the keyboard fix either. Tailwind
  v4's floor is Safari 16.4. Don't debug against it.
- Wizard submit (`POST /matches`) is still the next real feature; the missing-`title` 500 still needs
  a generated title.

## Session — 2026-08-28 (pm): drafts, the iOS keyboard, and the doc catch-up
Six commits on `main`, **not pushed** (both remotes are at `4671a03`). Started as a docs session and
turned into a bug session; two of the fixes came out of a screen recording from a real iPhone.

- **Docs caught up** (`011b1f7`) — session-state, CHANGELOG and STATUS had stopped at 2026-08-23, so
  the whole live-API week existed only in the git log. Also `4671a03`: **`durationHours` is not a
  gap** — matches are booked by the hour, so there's no half-hour duration to express (user), and the
  wizard's ۶۰/۱۲۰ map onto 1/2. Only the silent truncation of `1.5` is still worth asking for.
- **OTP paste** (`708087c`, **works**) — `handlePaste` was always there; the real input was
  `opacity-0`, and neither iOS nor Android offers the long-press Paste menu on a fully transparent
  field. Visible element, invisible contents instead. Confirmed pasting fills all five boxes.
- **The iOS keyboard drift** (`ac70a4b`, **unverified**) — from the recording: focusing a field
  dragged the whole page, the card sliding off the top, off the *right*, or behind the keyboard.
  Safari never shrinks the layout viewport for the keyboard, so `min-h-dvh` stays full height and the
  bottom-pinned `AuthCard` ends up under it; Safari then finds both scroll paths dead (document can't
  scroll, `AppScroll`'s content is exactly its own height) and **pans the visual viewport** instead.
  `AppScroll` is now sized to `--vvh`. **This is the one thing still needing an iPhone.**
- **Wizard drafts** (`85ad11a`, `640ac98`) — autosave to localStorage + a resume bar on step ۱.
  The asked-for "save as draft?" prompt was deliberately *not* built: the App Router has no
  navigation-blocking hook, so it would catch the ✕ and miss the hardware back, a nav tap and the
  edge swipe — one exit in four, while teaching people the draft is safe. Discard is a small
  underlined label, not a matching pill, so an irreversible tap isn't sitting beside the wanted one.
- **`/dev-login` was broken by the morning's 401 fix** (`aba2db2`) — the bypass token is one the API
  rejects by design, and "the server is the authority" logged it straight out on the first
  `/players/me`. Now exempt behind the same `NODE_ENV` guard the page uses for `notFound()`.
- **Join requests moved to the top** (`503a1c7`) — درخواست‌های ورود was below the FAQ on the match
  page; on a live match it's the most time-sensitive thing a creator does. It takes the slot under
  `MatchStageCard` that creator/live leaves empty. A header button was rejected: the header is in
  flow, so it scrolls away and would only help someone already at the top.

### Next
- **The iPhone is the blocker.** Unverified on iOS: the keyboard fix, plus the zoom lock and
  `app/error.tsx` from earlier in the week. `/otp?phone=…&expires=…` reaches the screen with no
  backend, and `/dev-login` reaches the guarded pages, so a dead API doesn't block any of it.
- Push all six commits to both remotes.
- Wizard submit (`POST /matches`) is still the next real feature — step ۲ produces a valid `clubId`
  and 08-27 brought field-level errors; work around the missing-`title` 500 with a generated title.

## Session — 2026-08-27/28: zoom lock, 401 handling, copy
On `main`, pushed to both remotes (`eae34d5`).

- **The app can no longer zoom** (`98c8c07`). Pinching pushed the fixed bars off-screen, and iOS
  auto-zooms on focusing any field under 16px — which is every input here, they're all `text-sm`.
  Three layers because none covers every browser: `user-scalable=no` + `maximum-scale=1` in the
  viewport export (Android, the installed PWA, and the focus-zoom everywhere), `touch-action:
  manipulation` on `body` for double-tap, and a `gesturestart` guard in `AppScroll` for pinch in an
  iOS Safari tab, which ignores the meta. **Costs pinch-zoom as a reading aid** — if that bites, the
  answer is larger text, not zoom back on.
- **A 401 ends the session; a local clock no longer decides** (`9c9f0d3`). `apiFetch` only logged out
  if `exp` had passed *here*, so rotating the JWT signing key on a deploy left every stored token
  looking valid: the 401 fell through to the generic error screen, whose retry replayed the same 401,
  with nothing routing back to `/login`. The server is the authority now — after the one
  refresh-and-replay chance, a 401 clears the session. Safe because this API uses **403** for
  authorization. `lib/api/client.test.ts` covers the four paths (key rotation, stale-token recovery,
  refresh-then-still-401 with no loop, `auth:false` untouched): `npx tsx lib/api/client.test.ts`.
- **Copy** (`eae34d5`): `/matches` is a date-strip page — it always shows one day — so the hero and
  the empty state say **مچ‌های روز** rather than claiming the whole app is empty. Wizard: عمومی
  points at the list by its new name, آمریکانو says بازیکنان (یاران was retired by the step-4 rework).

## Session — 2026-08-24/25: the live API probe
On `main`, pushed to both remotes. Ten commits; the bulk of the output is **`_designer/api-findings.md`**,
which is now the record of what the deployed API *does* rather than what its spec claims. The backend
redeployed repeatedly mid-probe, so several findings are dated snapshots.

- **`scripts/api.sh`** (`c6acbc9`, README'd in `e5ed290`) — access tokens last 15 minutes, so every
  hand-run curl needed a fresh one pasted in. The script does the whole dance: OTP login → verify →
  admin login, then any GET/POST with the bearer attached and a refresh when `exp` passes. Session in
  `.api-session.json`, **gitignored — it holds a real refresh token**. Settled three unconfirmed
  integration notes: phone format is `09…` (not `+98…`), gender is `MALE`/`FEMALE`,
  `profileCompletionStatus` is `COMPLETE`/`INCOMPLETE`. Later hardened (`3f30c8e`) to refuse writing a
  session with no `accessToken` — the API 500s during deploys and the old save wrote that error body
  straight over the stored tokens, losing the login.
- **Court picker now fetches real clubs** (`b5a3cb2`) — step ۲ was picking from five invented Karaj
  clubs, so the id it produced meant nothing and `POST /matches` requires a `clubId` it recognises.
  `ClubResponse` maps onto `CourtOption` exactly (name→club, address→location); filtered to `ACTIVE`;
  paging stood in for by one oversized page (five clubs, one city). **This is the first part of the
  wizard that can produce a submittable match.**
- **An error boundary at the app segment** (`8752174`) — there was none, and every accessor is read
  through `useSuspenseQuery`, which throws when a fetch fails. Free while `lib/data` returned mocks;
  not free now the court picker fetches. One boundary covers every page, so the read paths still to be
  wired get it without further thought. Build-verified, **not yet seen rendering in a browser**.
- **Roster names arrived** (`3f30c8e`) — the API replaced `organizerAccountId` with a nested organizer
  object and put `firstName`/`lastName` on participants, so the players grid, the creator's name and
  the approve/reject rows have something to render.

### What the probe found (all in `_designer/api-findings.md`)
- **`POST /matches` names the offending field now** (`a24151e`) — `loc: "format"` with a Persian
  message for a bad enum, `loc: "clubId"` for an unknown club, so the wizard can finally highlight
  what's wrong. Still open: a *missing* field comes back all-null (the `@NotNull` path skips the new
  handler), a missing `title` still **500s**, bean-validation messages leak untranslated English, and
  `scheduledAt` has picked up an **undocumented must-be-future constraint** the wizard should know.
- **The create-match spec is wrong** (`01bd155`, `63d9ada`) — `title`, `capacity` and `durationHours`
  are mandatory in practice but unannotated. Only `durationHours` is required on both sides: عنوان مچ
  is labelled اختیاری and step ۱ gates on format and invite alone, and capacity isn't a concept the
  wizard has (رقابتی caps at four, دوستانه/آمریکانو are deliberately uncapped — inexpressible).
- **`durationHours` is an integer** (`31ffba8`) — **not a gap**: matches are booked by the hour, so
  there is no half-hour duration to express (user, 2026-08-28), and the wizard's ۶۰/۱۲۰ map onto 1/2.
  What's left is that `1.5` is silently truncated to `1` rather than rejected, and there's no upper
  bound (99 hours accepted).
- **Every UUID 500 is one missing handler** (`e550b59`) — any id `UUID.fromString` can't parse throws
  past the exception handlers on every controller; Java's lenient parser is why it looked
  per-endpoint (a truncated uuid parses and 404s, one trailing character 500s). Also: **DELETE is a
  soft delete** — the match becomes `CANCELLED` and stays readable by id and invite token, so a saved
  link resolves to a cancelled match rather than a 404 and **the app must handle that state**.
- **Invisible invitations** (`40b31fc`) — there's no organizer-side invitation list, and an invite
  stays out of `participants` until accepted. Worse, the *design* has no pending state:
  `PlayerSlotButton` renders a filled chip or a dashed افزودن بازیکن, so an already-invited player
  looks identical to an empty slot, and re-inviting returns `matchmaking.invite.alreadyInvited` as a
  raw key. The wizard models دعوت‌شده in step ۵, but it lives in the draft and dies on save.
- **No player lookup** (`339a214`) — the JWT's account id is not the player id and there's no endpoint
  for any player but yourself, so the wizard's add-a-Patch-player flow has no endpoint behind it.
- **برگزار کننده has no API representation** (`8f46d71`) — the API knows exactly one organizer, the
  caller who POSTs. We treat that as the *creator* and keep برگزار کننده (مربی) as a role a
  player-creator can hand to a teammate, so `draft.myRole`/`draft.coach` are dropped on save. Flag the
  vocabulary when raising it: the API's "organizer" is our creator, and the two read as synonyms in Persian.

### Next
- Wizard submit is the next real step: step ۲ produces a valid `clubId`, so wire `POST /matches`
  against the field-level errors, working around the `title`-500 by sending a generated title when
  عنوان مچ is left empty.
- Backend asks, in order: annotate the required create fields + stop the missing-`title` 500;
  reject a non-integer `durationHours` instead of truncating; an organizer-side invitation list; a
  player lookup endpoint.
- The error boundary and the whole zoom lock are **unverified on a device**.
- Still carried from 08-23: the wizard-footer sliver check (step 1 → 2), `/activity` missing from
  `BottomNav`, `TournamentCard`'s dead جزئیات تورنومنت CTA.

## Session — 2026-08-23: the Safari device pass
All committed to `main` (6 commits) and pushed to both remotes. Everything here came from
screenshots on a real iPhone against `10.49.218.155:3000` — this is the device check the
2026-08-08 "Next" list asked for, and it found five bugs that no amount of desk review would have.

- **The app had no background of its own.** `body` was `bg-black` while every screen paints light
  content on top; iOS Safari tints its toolbars from the pixels at the scroll edge, so the bars
  flipped black/blue per screen. `--background` is `#F5F7FA` now (matching `manifest.json`'s
  `background_color`), plus `color-scheme: light` and a pinned `themeColor`.
- **`--hero-gap`**: a 12px band of `bg-surface` above every hero. The four `SportPageHeader` /
  `MatchDetailsHeader` pages held a blue bar because their hero is `fixed top-0`; `/profile`'s is
  in-flow by design and scrolled away to white. Now the surface is the top edge on all five.
- **The document no longer scrolls** — `AppScroll` (`app/_components/`) is an inner container and
  `body` is `overflow-hidden`. Safari minimises its toolbar on *document* scroll and keeps the
  vacated strip as a tap target, which was eating the first tap on the create wizard's بعدی every
  time. Padding the bars up was tried first and can't win: the strip is as deep as the toolbar.
  **This is now a project invariant — nothing may read `window.scrollY`; use `appScrollEl()`.**
- **Safe areas**: `viewport-fit=cover` + `--safe-b`, since nothing in the app read
  `env(safe-area-inset-*)` and they were all reporting 0.
- **Two follow-on regressions from AppScroll, both caught and fixed**: `BottomSheet` and
  `AuthSearchSelect` were locking `document.body`, which is *already* hidden — so nothing was
  locked and pages scrolled behind every sheet. And `.portrait-only`'s media query froze `body`
  for the same dead reason.
- **`.fixed-bar` + a footer `key`**: Safari left a strip of the step-0 full-width بعدی painted under
  the halved row (a blue sliver in the `gap-3`). `translateZ(0)` alone didn't take — it promotes the
  layer without forcing its contents to repaint — so `WizardFooter` is now remounted via `key` when
  the back button appears. **Committed before an on-device check.**
- **`BackButton` in `AddPlayerSheet`** hard-coded `flex-1`, right in the phone-invite row and wrong
  in the picker's column, where it set flex-basis 0 on the vertical axis and collapsed under a long
  list instead of letting the list scroll.
- **`BottomBar`** (`app/_components/`) extracted: the three fixed bottom bars were copy-pasting the
  same frame, and that string changed twice in one day.

### Next
- **Verify the wizard-footer sliver on device** (step 1 → 2). If it recurs, the guaranteed fix is to
  stop the footer changing shape — always render قبلی, disabled on step 0 — but that changes how
  step 0 looks, so it needs a decision.
- Two audit items are actionable without the API: `/activity` isn't wired into `BottomNav` (no active
  tab), and `TournamentCard`'s جزئیات تورنومنت CTA is still a dead `<button>`.
- 30 open TODO items and ~37 open audit findings remain, nearly all blocked on the backend.
- **Turbopack silently serves stale CSS** here — a `touch` doesn't wake it, and `.next` is an ext4
  mount so `rm -rf .next` fails busy. Two "nothing changed" reports this session were that, not the
  code. Verify the served chunk before re-diagnosing.

## Session — 2026-08-08: create-wizard players rework, dead-backend hardening, QA
Work on `main`, **not yet pushed** (origin/patchapp are ~20 commits behind).
- **Headers**: the compact-bar attempt was replaced by a real **collapsing hero** — one `--collapse`
  var (`lib/useCollapseHeader.ts`) drives `.hero-collapse*` in globals.css; title, buttons, date strip,
  photo and the profile avatar all shrink. Fixed + same-height spacer so the page never reflows. Two
  device-reported bugs fixed: dead space above (title/actions now ride up) and the date strip clipping
  at both edges (scaling a full-width scroller about its centre — now inverse-width compensated).
  The profile avatar moved **into** the hero so it collapses with it.
- **Step ۴ بازیکنان rework**: نقش شما is a `RadioCardGroup` like step ۱; teammates are added only via
  the dashed button (the three standing fields were redundant); `AddPlayerSheet` adds by Patch player
  **or phone invite**; رقابتی caps the roster at ۴, دوستانه/آمریکانو are uncapped; a player-creator can
  hand the برگزار کننده role to a teammate. `teammates` is now `Teammate[]`, not a 3-slot tuple.
- **Step ۳**: hourly starts ۰۸:۰۰–۲۴:۰۰, durations ۶۰/۱۲۰ only.
- **Backend down all day** — it went from fast 502s to **not answering at all**. Fixed three ways the app
  waited forever: 10s `AbortSignal.timeout` in `apiFetch`, `retry: false` on `["me"]`, and
  `useRequireAuth` no longer blocks rendering on `/players/me`. Added `/dev-login` (404s in production,
  verified against a real prod build) to work on guarded pages meanwhile.
- **`BottomSheet`**: `onClose` into a ref (deps `[open]`) + a popstate guard, after a mount-time sheet
  flashed open/shut. The cure was making `AddPlayerSheet` stay mounted like every other sheet.
- **ds-qa-tw**: `AddPlayerSheet` (2 Warning, 5 Suggestion) + collapsing header (3 Warning, 2 Suggestion),
  audit-only. Top items: one duplicated mobile-number rule across /login and the invite sheet, invite
  validation silent to screen readers, collapsed touch targets under the 44px project minimum.

### Next
- **Device check the collapsing header** — none of it has been seen in a browser (no Chrome here).
- Push to origin + patchapp; delete `app/dev-login/` once the API is back.
- Backend: nginx up, app process dead — every endpoint hangs.

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
