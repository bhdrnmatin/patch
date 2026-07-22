# TODO

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
- [ ] Sort by مسافت/تاریخ and filter by مسافت/تاریخ/نوع select but don't narrow — `MatchListItem`
      has no backing fields; wire when the API adds them. Same for tournaments/activity lists.
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

## Tournaments — audit (2026-06-16)
### Behavior wiring (post-mock)
- [ ] TournamentCard: make the "جزئیات تورنومنت" CTA a `<Link href="/tournaments/{id}">`
      once the detail route exists (currently a dead `<button>`). Same shape as the MatchCard CTA item.
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
- [ ] "انتخاب روی نقشه" (StepLocation) is a dead button — wire to a real map picker when a maps SDK exists.
- [ ] createMatch stores only a MatchListItem; the details page still renders the shared mock for any id —
      per-id match storage when the API lands.
- [ ] Teammate identity = indexes into `pickablePlayers` (no `MatchPlayer.id`) — same API-era switch as results.
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

## API integration (2026-07-18, branch feat/api-auth-profile)
### Blocked on backend
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
- [ ] Photo visibility toggle is write-only — `/players/me` has no visibility field, so it can't reflect the saved state; wire the read side when the backend adds it.
- [ ] Swap the mock `lib/data/*` accessor bodies to `fetch` as matches/tournaments/courts/activity
      endpoints ship (the seam is already in place).

## Activity — audit (2026-06-17)
### Behavior wiring (post-mock)
- [ ] ActivityCard actions are placeholder `<button>`s (no onClick/navigation) — wire to the relevant
      flows (cancel/pay/approve/details) when those exist.
- [ ] Wire `/activity` into BottomNav (nav has 4 tabs + add; no Activity slot — page shows no active tab).
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
