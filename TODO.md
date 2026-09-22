# TODO

## Out of MVP scope (user, 2026-09-22)

- **Tournaments — route parked 2026-09-22.** No backend API exists for them and none is
  planned for the MVP. The folder is `app/(main)/_tournaments/`; the leading `_` makes it a
  Next private folder, so nothing routes while the page and its `_components/` still compile
  and type-check (same treatment as `_onboarding`). Rename it back to revive it. Nothing below
  is a to-do — don't wire, audit or polish them.
- **Profile privacy toggle.** All profiles are public for the MVP. `PUT /players/me/visibility`
  and `PlayerResponse.profileVisibility` both work (probed live 2026-09-22, full round trip), but
  the feature is not wanted — leave the «حریم شخصی» row in `profile/settings/page.tsx` commented out.
- **Telegram notification on a failed deploy.** Dropped; `.githooks/pre-push` is the whole
  story on red builds.

## Token gaps — Matches audit (2026-06-08)

The Matches components use recurring hardcoded grays with no token (consistent
with existing components like StatCard/ProfileMeta, which hardcode the same hexes).
Decide: add semantic tokens to `app/globals.css` `@theme`, adjust the design, or accept.

- [x] Token gap (gray scale) — **done 2026-06-10**: added `--color-ink` (#00254D),
      `--color-ink-soft` (#253343), `--color-muted` (#6783A0), `--color-surface` (#F5F7FA),
      `--color-divider` (#E5EAF0), `--color-edge` (#D0DDEC, borders + avatar bg) to `@theme`;
      all hardcoded usages across Matches/profile/nav replaced with token classes.
- [x] Token gap (StatusBadge) — **accepted as one-off**: held green pair `#E8F5E9`/`#2E7D32`
      used in exactly one component; promote to status tokens only if a second consumer appears.
      (Not-held state now uses `bg-surface text-muted`.)
- [x] Token gap (radii) — **accepted as one-offs**: sheet 40px / close 20px / header 24px
      each occur once; `BottomSheet` is shared so the sheet radius lives in one file anyway.
- [x] Token gap (shadows) — **accepted for now**: three distinct shadows in three places;
      revisit an elevation scale only when more layers exist.

## Matches — behavior wiring (post-mock)
- [x] Wire SortSheet selections to actually sort `matchList` — **done 2026-07-12**: sheets are
      controlled (`MatchSort`/`MatchFilter` + exported defaults); /matches sorts by fee and filters
      by status + level; tournaments/activity pass their own (still-cosmetic) state.
- [x] Wire FilterSheet selections to actually filter `matchList` — **done 2026-07-12** (see above).
- [x] The header date strip narrows `/matches` — **done 2026-09-14**: it was hardcoded mock days;
      `dayStrip()` derives it from the clock and `MatchListItem.day` (Tehran date) is what a cell
      matches. No day selected on open (user decision); re-tap clears. Tournaments/activity strips
      stay cosmetic — their list items carry no ISO date.
- [x] **Neshan's cache headers — probed 2026-09-21: there are none.** No `Cache-Control`, no `ETag`,
      no `Last-Modified` on a 148KB PNG, so it wasn't even heuristically cacheable and every return to
      a club refetched it. The `headers()` rule this item proposed **cannot work** — Next skips
      `headers()` entirely for an *external* rewrite (verified: the same rule lands on a normal route
      and never on the rewritten one). `/map/static` is a route handler now (`app/map/static/route.ts`)
      that owns its response: `public, max-age=86400` on a hit, `no-store` on a failure, plus a
      server-side `revalidate` so one club's map is fetched from Neshan once for everyone.
- [x] **FilterSheet's تاریخ facet — wired 2026-09-22** (`dateFacetRange`, Jalali week/month).
- [~] (original note) FilterSheet's **تاریخ facet (امروز/این هفته/این ماه) is now unblocked** — `MatchListItem.day`
      is an ISO date, so all three are computable. Left unwired 2026-09-14: the strip already covers
      picking a day, so wire this only if the facet is worth keeping beside it.
- [x] **Sort/filter — done 2026-09-22.** مسافت removed from both sheets (needs the viewer's
      location; one-city MVP). تاریخ wired in both: sort on `MatchListItem.startMs`, filter on
      Jalali ranges (`dateFacetRange`). Left: the **نوع** facet still can't narrow — the card
      carries no `matchType`, and رقابتی is refused by the API anyway, so it waits with levels
      and fees. The activity list's own sheets stay cosmetic.
- [ ] MatchCard: consider `<ul>/<li>` list semantics + `<h2>` heading order.

## Token gaps — Match Details audit (2026-06-10)
- [x] Token gap (FaqItem) — **resolved 2026-06-11**: `ink-soft` blessed as the substitute
      for `#30445B`; chevron swept.
- [x] Token gap (CourtCard) — **resolved 2026-06-11**: added `--text-display` (32px/56px)
      to `@theme`; club heading uses `text-display`.
- [x] Token gap (elevation, REOPENED) — **done**: `--shadow-card`/`--shadow-pop` landed 2026-06-11;
      the 2026-07-12 polish pass swept the six remaining one-off shadows and added
      `--shadow-sheet` + `--drop-shadow-hero` (checkbox was stale).
- [x] Decision (gray ramp) — **blessed 2026-06-11**: nearest-token mapping is the rule
      (documented in CLAUDE.md Design Tokens); no ramp tokens added.

## Tournaments — audit (2026-06-16) — **OUT OF MVP SCOPE**
### Behavior wiring (post-mock)
- [~] TournamentCard CTA → `<Link href="/tournaments/{id}">` — **dropped 2026-09-22**, no
      tournaments API for the MVP. The dead `<button>` stays dead.
### Token gaps
- [x] Token gap (TournamentPoster): `rounded-[20px]` (20px radius) — **accepted as one-off 2026-06-16**
      (consistent with sheet 40px / close 20px single-use radii). Revisit if a second consumer appears.
- [x] Token gap (PosterBadge): `backdrop-blur-[4px]` — **accepted as one-off 2026-06-16** (meaningful
      over the poster). The TournamentCard CTA's no-op copy was **removed** in the refactor.
### Refactor candidates (Warnings)
- [x] PosterBadge duplicated StatusBadge's status→Persian labels — **fixed 2026-06-16**: extracted to
      `lib/status.ts` (`statusLabels`); both components import it.
- [x] SportPageHeader inverted dependency — **fixed 2026-06-16**: relocated `icons`, `IconButton`,
      `DateCell`, `DateSelector` from `matches/_components` to the shared `(main)/_components/`; all
      importers (matches, tournaments, match-details `[id]`) repointed. `PriceTag` + sheets stay in
      matches (feature→feature reuse). CLAUDE.md component-library section updated.

## Results entry — audit (2026-07-11)
### Behavior wiring (post-mock)
- [ ] "ثبت نهایی نتایج" CTA on `/matches/[id]/results` is cosmetic — persist games/sets when the API exists.
- [ ] Player identity in results state is the array index into `matchDetails.players` — `MatchPlayer`
      has no `id`. Switch to real player ids when the API defines them (affects GameCard/PlayerPickerSheet).
### Refactor candidates (Warnings)
- [x] ScoreStepper: silent value changes — **fixed 2026-07-11** (`aria-live="polite"`; − hover parity added,
      floor-disable rejected: dropping focus mid-interaction is worse than a no-op tap).
- [x] PlayerSlotButton: repeated accessible names — **fixed 2026-07-11** (required `slotLabel` prop).
- [x] GameCard: set-button context + `rounded-group` + h2 heading — **fixed 2026-07-11**.
- [x] PlayerPickerSheet: `aria-pressed` on rows — **fixed 2026-07-11**.
- [x] SectionCard `rounded-3xl` decision — **swept 2026-07-11**: ALL `rounded-3xl` (+ `rounded-t/b-3xl`)
      replaced with `rounded-group` variants app-wide (SectionCard, FaqSection, ScheduleCard ×3,
      CourtCard ×2, StoryCard, MatchCtaBar, MatchDetailsHeader). Rule documented in CLAUDE.md:
      24px radius = `rounded-group`, never raw `rounded-3xl`.

## Create match — audit (2026-07-12)
### Behavior wiring (post-mock)
- [ ] Every wizard-created match is **free** — the entry-fee field was removed from the (since
      deleted) step ۵ on
      2026-08-12, so `createMatch` writes `price: 0`. `MatchListItem.price`, the /matches price tag and
      the fee sort all still exist; restore a fee input (or take it from the court reservation) when
      pricing is decided.
- [ ] The wizard no longer asks **how players get in** — step ۵ تنظیمات and `draft.joinMethod` were
      removed 2026-08-20 (unused; nothing consumed them). Bring the step back with the join flow:
      "approval" is what should produce the `JoinRequest` rows the details page already renders, and
      "invite" is what should reject a join that doesn't come through the invite link. In git history
      (`StepSettings.tsx`, `JOIN_METHOD_OPTIONS`).
- [ ] createMatch sends the match and its **phone invites**, but not picked Patch players — the pick
      list is the mock, and the API invites by phone only. Kept visible (user decision 2026-09-16)
      while the backend adds account ids; see "Blocked on backend".
- [ ] Teammate identity = indexes into `pickablePlayers` (no `MatchPlayer.id`) — same API-era switch as results.
- [x] **"از بین بازیکنان پچ" lists only players you have played with — done 2026-09-19.**
      `getPickablePlayers` reads `GET /matches/invitations/suggestions`, which is exactly that list
      and now carries `phoneNumber`, so the picked player is invited by phone like a typed one. The
      list can legitimately come back empty, and the sheet says so instead of rendering nothing.
- [x] Phone invites no longer ask for a name — **done 2026-09-12**, the number is the identity and is
      what the roster, review and team preview display.

## Component QA — ds-qa-tw audit (2026-08-08)
`AddPlayerSheet` (0 Critical, 2 Warning, 5 Suggestion) and the collapsing hero header
(0 Critical, 3 Warning, 2 Suggestion). Actionable:
- [x] **Duplicated mobile-number rule** — **done 2026-08-12**: `isValidMobile()` in `lib/persian.ts`
      normalizes to Latin then tests `/^09\d{9}$/`; `/login` and `AddPlayerSheet` both call it.
      Self-checked by `lib/persian.test.ts` (`npx tsx lib/persian.test.ts`).
- [x] **Invite validation is silent to screen readers** — **done 2026-08-12**: `TextField` takes an
      `error` prop and owns the wiring (`aria-invalid`, `aria-describedby` → a `role="alert"` message,
      danger border). The sheet's hint `<p>` no longer doubles as the error.
- [x] **Collapsed touch targets under 44px** — **done 2026-08-12**: `.hero-collapse-actions` scales
      0.22 → 0.0834, so the filter/sort buttons floor at exactly 44px (verified in Chrome at
      `--collapse: 1`: 44×44). The `DateCell` half of the finding was **stale** — the date strip
      hasn't been scaled since the RTL-scroller fix, it stays 52px at every step.
- [x] **Collapse geometry is split across two files** — **done 2026-08-12**: `--hero-max`/`--hero-min`
      are now declared in `globals.css` next to the rules they size (`:root` + a `.hero-collapse-dates`
      modifier for the taller collapsed bar). No hero constants remain in TSX.
- [x] **`useCollapseHeader(range)` contract is comment-only** — **done 2026-08-12**: the hook takes no
      argument and reads `--hero-max`/`--hero-min` off the element, so the caller can't state a range
      that disagrees with the CSS. Callers just add `.hero-collapse` and a `h-[var(--hero-max)]` spacer.
- [x] **A red build is caught before it's pushed — done 2026-09-21.** `.githooks/pre-push` runs
      `npm run build` and refuses the push on failure (enable per clone with
      `git config core.hooksPath .githooks`; docs-only pushes skip it, `--no-verify` overrides).
      Verified by reintroducing the 2026-09-20 `/login` prerender bug: the hook fails with Next's
      own message and exits 1. This is prevention, not CI — the deploy still goes red silently in
      Gitea, so **a notification on a failed deploy is still worth having** if pushes ever bypass
      the hook (another clone, a CI-side failure that doesn't reproduce locally).
- [ ] Smaller: sheet actions into `BottomSheet`'s `footer` (SortSheet/FilterSheet convention), focus the
      phone field on view switch, rename the stale `slotLabel` prop, hook assumes `window` is the scroller.
- [~] **Device check** — the collapsing header has now been seen in a **desktop headless Chrome** at
      390×845 (the puppeteer cache has a real Chrome; `/usr/bin/chromium-browser` is a snap stub that
      won't launch). Open and collapsed geometry both check out: header 276 → 130px with dates / 72px
      bare, the spacer's bottom edge tracks the header's height exactly at every step (no reflow, no
      slide-under), collapsed buttons 44×44 clear of the date strip, profile title 20–52px with the
      avatar tucked beside it. **Still unverified on a real phone**: momentum/rubber-band scrolling and
      the iOS URL-bar resize, neither of which headless reproduces.

### Add-player rework (2026-08-08)
- [x] Phone invites are sent — **done 2026-09-16**, `POST /matches/{id}/invitations` right after the
      create. Own number and duplicates are refused at the sheet's button; anything the server still
      rejects is listed on the wizard (`InviteFailures`) before رفتن به مَچ. The own-number check needs
      `patch.phone`, saved at OTP verify, so sessions from before that skip it until next login.
- [x] **The share link works — done 2026-09-20.** `/join/[token]` previews the match and joins in
      one tap, signing the opener in on the way (`next` survives login *and* signup). Only the
      organizer's copy carries an `inviteToken`; everyone else's card still shares the match URL.
      See api-findings §0j for what the endpoints do and don't allow.
- [x] **The wizard shares the link — done 2026-09-21.** Create now ends on a success step carrying
      `ShareCard`, fed by the `inviteToken` on the create response. Still *after* creation: a token
      can't exist before the match does, so sending invites from mid-wizard would need the backend to
      mint a draft/pending-match token first.
- [x] **Secure-context sharing — fixed 2026-09-22.** `lib/share.ts` falls back to
      `execCommand("copy")`, then to showing the link. Both share buttons use it.
- [ ] (original note) `navigator.share` + `navigator.clipboard` need a **secure context** — they're unavailable over
      plain `http://<lan-ip>:3000`, so the share card silently no-ops in LAN dev testing. Fine in
      production (https); add a legacy `execCommand("copy")` fallback only if dev testing needs it.

### مکان rework (2026-08-04)
- [x] مسیریابی button (StepLocation selected-court card) was cosmetic — **fixed 2026-09-12**: it's an
      `<a>` to `nshn.ir/?lat=&lng=` (Neshan), which opens the app when installed and the web map
      otherwise. Lands on the pin rather than starting a route, so it needs no geolocation permission.
      (The old "انتخاب روی نقشه" custom-court button was removed in this rework.)
- [ ] Court picker is mock (5 hardcoded Karaj courts in `courtOptions`); `reserved` + `courtId` aren't sent
      anywhere — wire to a real courts/reservation API when it ships.
- [ ] استان/شهر are locked to البرز/کرج (disabled `SelectField`) for single-city launch — swap for the live
      province→city searchable cascade (same pattern as profile-edit) when multi-city.
- [x] The court map was a static SF placeholder (`court-map.webp`) — **fixed 2026-09-12**: Neshan static
      map at the club's real coordinates, proxied through `/map/static` so the key stays server-side.
      The image is hidden (button kept) whenever that request fails.
- [ ] **Production still has no `NESHAN_API_KEY`, so every deployed court map is blank** (found
      2026-09-21 — it had been blank since the map shipped, and nobody had looked). The deploy
      workflow passes no `--build-arg` and the container gets no env, so the key reaches neither
      build nor runtime. It's a **runtime** value now: add it to `/apps/docker-compose.yml` under
      the frontend service's `environment:` and recreate. Verified end to end against the real
      production image — `docker run -e NESHAN_API_KEY=…` serves a 148KB PNG, without it Neshan
      480s and the map hides itself. Nothing in the repo can fix this; the compose file lives on
      the server.
- [x] Dedup: the map + مسیریابی button in StepLocation duplicated match-details `CourtCard` —
      **fixed 2026-09-12**, both compose `CourtMap`. That duplication is *why* the bug existed twice.
- [ ] `MatchDetails.courtLat/courtLng` are mock values (باشگاه انقلاب ≈ 35.7088, 51.3854) — the match
      details endpoint isn't wired, so a real match's map points at the mock club until it is.
### Refactor candidates
- [x] StepChips 44px chips + keyboard-reachable current chip — **fixed 2026-07-12**.
- [x] AvailabilityHeatmap `role="grid"` removed + `SWATCH_TONE` legend map — **fixed 2026-07-12**.
- [x] WizardFooter `aria-busy={pending}` — **fixed 2026-07-12**.
- [x] SelectField `aria-haspopup="dialog"` — **fixed 2026-07-12**.

## Design polish pass (2026-07-12, branch design/polish-pass)
- [ ] MatchCtaBar renders destructive actions (لغو مسابقه) in primary blue — consider a
      `danger` variant now that the token exists (behavior semantics, deliberately not
      changed in the polish pass).
- [ ] Sheets unmount on close, so only the entrance animates — add exit animation if the
      instant close ever feels abrupt on device.

## API/auth code review (2026-07-22) — deferred (low priority)
- [ ] OTP-verify routing uses `queryClient.fetchQuery(["me"])`, which honors staleTime — an account
      switch within the stale window could route off the previous user's profile. Pass
      `staleTime: 0` (or `refetchQuery`) if account-switching without a full reload becomes a case.
- [x] `useAuth` `["me"]` query `retry: 1` — **done 2026-08-08**: now `retry: false`. It stopped being
      cosmetic when the backend started hanging: every guarded route waited on this query, so a retry
      doubled the stall. `apiFetch` also got a 10s `AbortSignal.timeout` (a hung fetch never settles,
      so the guard's error path never ran), and `useRequireAuth` no longer blocks rendering on `/me`.

## API integration (2026-07-18, branch feat/api-auth-profile)
### Blocked on backend
- [ ] **`POST /matches` — `scheduledAt` is handled in UTC, still.** Re-probed 2026-09-22: the
      400 is gone, but **nothing was fixed — it now floors to the UTC hour and never refuses.**
      `18:00+03:30` (14:30Z) is stored `14:00Z`; `12:59Z` is stored `12:00Z`. Iran is +03:30, so
      **every Tehran wall-clock hour is silently moved 30 minutes earlier**, and a typo'd minute
      is now discarded instead of rejected.
      **Do not remove `API_SHIFT_MS`** — it is load-bearing now. We send Tehran ۱۸:۰۰ as `14:00Z`
      and add the 30 back on read, which is *exactly* what the truncation produces anyway, so the
      app shows the right time. Anything else reading that instant (backend reminders, an admin
      panel, another client) is 30 minutes early.
      **Ask:** floor/validate in `Asia/Tehran`, not UTC. See `_designer/api-findings.md` §0.
- [ ] **The one-hour match lock is undocumented, and invites sit behind it** (probed 2026-09-19,
      api-findings §0e) — every write is refused from an hour before `scheduledAt`, which with
      `API_SHIFT_MS` is 90 minutes before the real start. Step ۳ greys those slots now (`LOCK_MS`
      in `lib/api/matches.ts`); ask whether invites need to be gated with edits at all.
- [ ] **Invite by account id** — still 400 `phoneNumbers must not be empty` (re-probed 2026-09-19,
      `accountIds` and `inviteeAccountIds` both). No longer blocking: suggestions carry `phoneNumber`
      now, so the picker invites by phone. Worth having anyway — it would stop the client handling
      other people's numbers to invite someone the server already knows.
- [ ] **Translate invite `failureMessage` keys** — `alreadyInvited`/`alreadyParticipant` come back raw;
      `inviteFailureText` maps the two we've seen and hides any other.
- [ ] **Enable `matchType: COMPETITIVE`.** رقابتی is greyed out until then — flip
      `COMPETITIVE_ENABLED` in `StepDetails.tsx`.
- [ ] **A missing `title` must not 500** (open since 2026-08-24). Worked around by always
      sending a generated title.
- [ ] **`capacity` should be nullable** — دوستانه/آمریکانو are uncapped by design; the mapping
      floors the roster at the API's minimum of 4 to get past validation.
- [x] **15-min logout — RESOLVED 2026-07-21:** the backend shipped `POST /auth/refresh`
      (`{refreshToken}` → `{accessToken, refreshToken}`, rotating). Token rotation is now wired in
      `lib/api/client.ts` (proactive refresh of an expired token + reactive refresh-and-replay on
      401, single-flight; only a dead refresh token ends the session). Sessions now survive the
      15-min access-token TTL.
- [~] `POST /api/v1/otp/request` was 500ing for every number — appears **resolved** (login now
      completes end-to-end; tokens are issued). Re-confirm if it recurs.
### Confirm once OTP works (a real token is reachable)
- [x] Gender value — **done**: profile-setup sends `MALE`/`FEMALE` via the `AuthSelect` dropdown.
- [ ] OTP routing uses empty firstName/lastName to detect "needs setup" — switch to the real
      `profileStatus` values once confirmed against a live `/players/me`.
- [ ] Verify the authed endpoints accept our payloads / return expected data (getMe, profile PUTs) —
      only reachability + 401 enforcement confirmed so far.
### Deferred (intentional)
- [ ] 429 rate-limit UI: surface the `retryAfter` countdown on the OTP request — left until the
      endpoint actually works.
- [x] Refresh-token rotation — **done 2026-07-21** (see the resolved 15-min-logout item above).
- [x] Profile avatar — **done**: `/profile` shows `avatarUrl` (default silhouette fallback) and
      `/profile/edit/personal` uploads via `uploadProfilePhoto`.
- [x] City — **done 2026-07-22**: profile-setup sends `residenceCityId` via a searchable province→city picker (`/provinces`, `/provinces/{id}/cities`).
- [ ] The 5-step assessment is still collected but not persisted (no API field) — send when added.
- [x] Photo visibility toggle — **removed 2026-08-02**: it was write-only (`/players/me` has no
      visibility field). The toggle, `updatePhotoVisibility`, and the `PhotoVisibility` type are gone;
      re-add the whole thing if the backend ever exposes the read side.
- [ ] Web OTP autofill needs the backend to end the SMS with `@<web-origin> #<code>` (Latin digits) —
      the client side (`navigator.credentials.get({ otp })` + `autocomplete="one-time-code"`) is wired.
- [ ] `username` was dropped from profile-setup on 2026-08-03 on the promise the backend is removing it —
      confirm it's actually gone from the API contract (and that `preferredSide` on display-info is final).
- [ ] Swap the mock `lib/data/*` accessor bodies to `fetch` as matches/courts/activity endpoints
      ship (the seam is already in place). Not tournaments — out of MVP scope.

## Activity — audit (2026-06-17)
### Behavior wiring (post-mock)
- [ ] ActivityCard actions beyond invitations are still placeholders — wire to the relevant
      flows (cancel/pay/approve/details) when those exist.
- [x] **`/activity` shows pending invitations — done 2026-09-19.** `getActivitySections` reads
      `GET /matches/invitations/me` and one `GET /matches/{id}` per invite; the card accepts or
      opens the match. No decline: that DELETE is organizer-only (api-findings §0g).
- [ ] `/activity` shows **invitations only**. Join requests you have sent, matches you are in and
      results waiting on you are all plausible sections — none has an endpoint that serves the
      viewer's own rows yet.
- [x] **`/activity` in the BottomNav — done 2026-09-19.** The tab was there all along, labelled
      «کاوش» from when the page was a mock discovery feed; renamed «فعالیت‌ها», and its red dot is
      real now — `getUnreadCounts` counts the invitations waiting for an answer. Every other route
      still has no notifications source.
### Refactor candidates
- [x] ActivityCard (Warning): card title `<span>`s → **fixed 2026-06-17**: wrapped in `<h3>`.
- [x] ActivityCard: `rounded-3xl` → `rounded-group` token — **fixed 2026-06-17**.
- [x] ActivityButton: filled hover — **fixed 2026-06-17** (`hover:bg-primary-hover` / outline `hover:bg-surface`).
      `flex-1` layout opinion kept (intended row-fill, inert standalone).
### Token gaps
- [x] Token gap (StatusThumb): `w-[91px]`, `text-[10px]` — **accepted as one-offs 2026-06-17** (Figma
      dimension / DateCell precedent).
- [x] Token gap (ActivityCard): `border-divider` for the #E9EDF5 card border — **accepted 2026-06-17**
      (nearest visible token; blessed map's #E9EDF5→surface is too light for a border).

## Component QA — ds-qa-tw audit (2026-07-22)
Audited the new auth/profile components. 0 Critical, 3 Warning, ~5 Suggestion. Actionable:
- [x] AuthSearchSelect: dialog semantics + focus trap — **done in the 2026-07-22 v2 refactor**
      (`role="dialog"` + `aria-modal` + `aria-label` + Tab trap). Verified 2026-08-03; also added
      focus-return to the trigger on close (v3). See _designer/audits/AuthSearchSelect.audit.md.
- [x] AuthSelect + AuthSearchSelect: option-list keyboard nav — **done in the 2026-07-22 v2 refactor**
      (Arrow/Home/End roving focus over the option buttons; ArrowDown from the trigger/search enters the
      list). Roving focus used instead of `aria-activedescendant`. Verified 2026-08-03.
- [ ] Minor (suggestions): AuthGuard blank-flash loader; LogoutRow `aria-busy`; `aria-controls` on the
      dropdown triggers. Details in _designer/audits/.

## Hero/list visual pass — 2026-09-16
- [ ] **Delete the dead photo-cutout props** on `SportPageHeader` (`bgImage`/`athleteImage`),
      `MatchDetailsHeader` (same) and `ProfileHero` (`bgSrc`/`athleteSrc`), plus their scrim branches.
      No caller passes them; `CourtBackdrop` is the only art path. CLAUDE.md's hero section mentions
      them — drop that paragraph too.
- [ ] The ball in `hero-court.webp` tucks ~5px behind the first date cell. Clearing it needs a ~57px
      zoom that crops the racket, so it's accepted; revisit only with a re-framed photo.
- [ ] Past-day date cells look grey in the collapsed bar over the photo — minor, raised by me, not the user.

## Next session — ds-qa-tw audit (user, 2026-09-22)

- [ ] **Audit the UI that shipped 2026-09-22 before starting anything new.** It was an API-wiring
      day, so a11y and token checks were skipped: `PlayerChip`'s organizer ✕, `PlayersSection`'s
      remove mutation, `CourtCard`'s club logo + tap-to-call row, `ShareCard`'s two-tap revoke and
      copy-failed fallback, `MatchDetailsHeader`'s wired share pill, and the cancelled-match frame
      (`MatchStageCard` with no dial). Each audit file already flags these as not yet audited.

## API probe — 2026-09-22 (see `_designer/api-findings.md`, last section)

### App-side, no backend needed
- [ ] **A cancelled match still renders as a joinable invite.** `GET /matches/invite/{token}`
      answers 200 with `status: CANCELLED` after the organizer deletes the match, and
      `app/join/[token]/page.tsx` only shows «این لینک معتبر نیست» when that GET *errors* —
      so the page draws the whole invitation and a «پیوستن به مَچ» button. Treat
      `status !== "OPEN"` as the same dead end the 404 already takes.
- [ ] **`POST /otp/verify` already returns `profileCompletionStatus`** (`INCOMPLETE`/`COMPLETE`).
      `app/(auth)/otp/page.tsx:87` throws it away and spends a `fetchQuery(["me"])` to learn the
      same thing. Declaring it on `VerifyOtpResponse` and routing off it deletes that round trip
      **and** the account-switch staleness item above.
- [ ] **Clubs carry `logoUrl`, `bannerUrl` and `contactPhone`** (all 5 seeded, real files on
      `media.patchapp.ir`). Declared at `lib/api/types.ts:62-65`, rendered nowhere — the court
      card shows a map and a name while a logo and a tap-to-call number sit in the payload.

### Unbuilt endpoints that exist (organizer tools)
- [x] `POST /matches/{id}/invite-token/regenerate` — **built 2026-09-22.** `ShareCard` offers
      «ساخت لینک تازه» to the organizer (`canRevoke`, `role === "creator"`), two-tap confirmed
      because it breaks every copy already sent, then invalidates `["matchDetails", id]` so the
      card shares the new token. Still **untested on a device**.
- [ ] `DELETE /matches/invitations/{invitationId}` — organizer withdraws an invite they sent.
      Verified working (status → CANCELLED).
- [ ] `DELETE /matches/{id}/participants/{participantId}` — organizer removes a player. Exists;
      the self-kick guard is verified, the happy path is not (needs a second account).
- [ ] `POST /auth/logout-all` — "sign out everywhere"; `LogoutRow` ends this session only.

### Backend asks (new)
- [x] **A cancelled invitation blocked the phone — fixed by the backend 2026-09-22.** Re-probed
      at 14:15: cancel → re-invite returns a new `PENDING` invitation. Inviting a number that
      still has a PENDING invitation is refused (`alreadyInvited`), which is the guard we want.
- [~] ~~A revoked invite link 404s as `مچ یافت نشد`~~ — **dropped 2026-09-22 (user):** not worth
      a backend round trip. «این لینک معتبر نیست» already tells the holder to ask for a new one,
      which is the only action available either way.
