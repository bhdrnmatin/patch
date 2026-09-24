# Session State

## Session — 2026-09-24 (afternoon): iPhone fixes, private matches, speed, activity
- **Backend data was reset** — test match `512d9b25` is gone; «تست» (`09379137806`) is a new account.
- Shipped: create-review avatars; own private matches in /matches (`GET /matches` omits PRIVATE even
  for the organizer); clubs fetched once per session + list no longer waits on `/activity`
  (1.2s); decline an invitation (new endpoint, **untested**); /activity current vs past; /activity
  sort/filter and logout-all moved **out of MVP**.
- **Held:** branch `feat/tehran-time` (local only) — sends Tehran time, drops `API_SHIFT_MS`,
  books from a full hour ahead. Merge only after the backend stores `18:00+03:30` as sent.
- **Blocked on backend:** withdraw invitation (needs `GET /matches/{id}/invitations`, promised),
  results/voting (needs a played 4-player match), Americano results, slow `/clubs` + `/activity`.
- Phone checks pending: `_designer/phone-test.md`.

## Session — 2026-09-24: ds-qa-tw audit of the 2026-09-22 UI (audit only, no code changed)
Six components audited; findings appended as new versions in `_designer/audits/` (new files for
`PlayerChip` and `ShareCard`). 0 Critical, 8 Warning, 13 Suggestion. Warnings worth fixing first:
- **MatchDetailsHeader #3:** share pill says «لینک کپی شد» when the copy *failed* (`result !== "shared"`).
- **ShareCard #1:** the revoke's armed state disarms only on `onBlur`, which iOS never fires on a tapped button. Needs a timeout.
- **PlayerChip #1:** removing a player is one tap, no confirm (inconsistent with ShareCard's two-tap rule).
- **PlayersSection #3/#4:** failed removal is silent; ✕ is offered on live/finished matches too.
- **ShareCard/Header #2/#4:** copied/renewed status not in an `aria-live` region.
- **Systemic → PROMOTE (awaiting user):** `text-muted` and `text-danger` small text fall under AA 4.5:1 on light surfaces.
**Fixed the same day** (the six above, not the PROMOTE): remove-player is arm → full-chip red confirm
(4s disarm) and only offered while `upcoming`, and failures show an alert; ShareCard's armed state
disarms on a 4s timer; the header pill says «کپی نشد» on a failed copy; status labels are `aria-live`.
tsc + eslint clean. **Not seen on a device** — the chip confirm needs an organizer on a real match.
Contrast promoted (anti-patterns #19, token decision in TODO.md). **Results API** landed on the
backend; the results page is now one game per match and submits (`6154dd0`) — GET result and voting
wait on a real result. Quick-fix batch: stage pill height, optional `stage`, stale header docs,
ShareCard opacity/timers, one removal at a time.
iPhone testing over LAN found three keyboard bugs, all fixed and verified on the phone: iOS scrolls
the document on focus (`AppScroll` now resets it and reveals the field in the scroller itself),
and `BottomSheet` is sized to `--vvh`. Lesson: reload the phone before judging a fix — the dev
server didn't always push the change.
**Next:** the results submit on match `512d9b25` as organizer سپهر (details in phone-test.md).
**Everything unverified on a device is in `_designer/phone-test.md`** — go through it first.
Still open (design calls): cancelled-status accent, lone hero pill width, call-row radius, hero
text-shadow token; plus the older heading-semantics suggestions.


## Session — 2026-09-21: the wizard's share card, and a build nobody was watching
Four commits, all pushed to both remotes (head `7fcf26b`). It started as one small feature and
turned into finding that the last three days' work had never left the machine.

### The wizard ends on a share card
The wizard could not share the invite link — the token only exists once the match is created, so
«رفتن به مَچ» sent the organizer to the match page to find it. Create now lands on a **success step**
carrying `ShareCard`, which is the moment an organizer most wants the link.

- **The step already existed — it just only appeared when an invite had failed.** A share button
  there would almost never have rendered, so it always appears now and `InviteFailures` became its
  failure half (its copy points at the card above it instead of at the match page). Every create
  stops here now; that was a deliberate flow change, not a side effect.
- `createMatch` returns the create response's `inviteToken` beside the id. The field was there all
  along and only the id was being read off it. **Confirmed live** — a fresh match shares
  `/join/{token}`, not its own URL.
- `ShareCard` stops drawing «محدودیت ورود» when there is no restriction. Levels ship after the MVP,
  so that was *every* real match: a label with nothing after it, on the match page too.
- **Tested on the phone and it works** — the OS share sheet opens, which desktop could never show
  (Chrome has no `navigator.share`, so localhost only ever exercised the clipboard fallback).

### The production build had been red for a day
`npm run build` **had been failing since `685e14a`** (2026-09-20). That commit gave `/login` and
`/profile-setup` a `next` param so an invite link survives signing up, and `useSearchParams` opts a
page out of static prerendering unless it sits under a Suspense boundary. The build bailed on
`/login` and **nothing had deployed since** — including that day's share-link work.

Nothing catches this: **`tsc --noEmit` passes, eslint passes, the dev server is fine.** It only shows
up in a real build, and the only thing that runs one is the deploy, which goes red in a Gitea tab
nobody opens. Both pages now use the same wrapper `/otp`, `/matches/[id]` and the wizard already had.

**`.githooks/pre-push` now runs the build and refuses a push that fails it** — verified by putting
the `/login` bug back, not by assuming. Opt-in per clone (`git config core.hooksPath .githooks`,
in the README), docs-only pushes skip it, `--no-verify` overrides. It is prevention, not CI: a push
from another clone or a failure that only happens in Docker still goes red silently. ~~A Telegram
notification on a failed deploy is the backstop~~ — **dropped by the user 2026-09-22**; the hook
is the whole story.

### The court map has never worked in production
Chasing the open «what `Cache-Control` does Neshan send» TODO answered it — **none at all.** No
`Cache-Control`, no `ETag`, no `Last-Modified` on a 148KB PNG, so it was not even heuristically
cacheable and every return to a club refetched it.

**The fix that TODO proposed cannot work, and that is the durable finding: Next skips `headers()`
entirely for an *external* rewrite** and passes the upstream response through untouched. Verified,
not assumed — the identical rule lands on `/matches` and never on `/map/static`. So `/map/static` is
a **route handler** (`app/map/static/route.ts`) that owns its response: `public, max-age=86400` on a
hit, `no-store` on a failure, and a server-side `revalidate` so Neshan is hit once per club rather
than once per visitor.

Which surfaced the real bug: **`NESHAN_API_KEY` reaches neither the build nor the container**, so
every deployed court map has been blank since the map shipped on 2026-09-12. The deploy workflow
passes no `--build-arg` and compose sets no env; the Dockerfile comment claiming CI passed it was
aspirational. It degraded exactly as designed — map hidden, مسیریابی kept — which is why nobody
noticed. **The key is a runtime value now**, so the Dockerfile deliberately bakes it in neither
stage. Verified end to end against the real production image: `docker run -e NESHAN_API_KEY=…` serves
the PNG, the same image without it gets Neshan's 480.

**The user has sent the ask.** The remaining half is one line in `/apps/docker-compose.yml` under the
frontend service's `environment:`, then recreate — no rebuild, it is read at runtime.

### Worth knowing
- **`grep` in the Claude terminal is a `ugrep` wrapper**, and it answers `grep -q -v` the *opposite*
  way to GNU grep — it classified every commit as docs-only. Anything under `sh` gets the real grep,
  so the hook was never affected, but `-q` stops at the first selected line and greps disagree about
  which that is. Prefer listing matches over asking `-q` whether any exist.
- `api.neshan.org` needs `NO_PROXY` like `patchapp.ir` does, or it fails at TLS.
- The deployed app is **`app.patchapp.ir`**; `patchapp.ir` serves something else.

### Next
- **Scope cut (user, 2026-09-22):** no Telegram deploy notification, and **tournaments are out of
  the MVP** — there is no backend API for them and none planned. Their route/mock/components stay
  compiled but nothing about them is a to-do.
- **Confirm the court maps appear** once the compose env lands.
- Still open: the audit findings (30 across 21 files once `TournamentCard` is set aside, heaviest
  `ActivityCard` 4 / `CourtCard` 3), the dead `bgImage`/`athleteImage` hero props, the ball behind
  the first date cell, the password-login test account, and last session's backend asks.

## Session — 2026-09-17/20: the wizard on a real phone, /activity, and the share link
Fourteen commits, all pushed to both remotes (head `685e14a`). The session was a phone in the
user's hand and a terminal probing the live API — almost nothing here was decided by reading code.

### The wizard, tested end to end for the first time
Five steps tapped through by hand on the phone. Four things came back:
- **The title is optional again** and an empty one is generated from the club and the start time
  («باشگاه انقلاب، ساعت ۱۸:۰۰»), shown on step ۵ before submit. The placeholder stopped suggesting
  «راکت طلایی», which is a real match now.
- **A duration fills every hour it covers** — ۰۸:۰۰ for ۱۲۰ دقیقه lights ۰۸ and ۰۹. `aria-pressed`
  still marks the start alone.
- **A player could not be removed.** An added row opens on the view it came from — the phone form or
  the pick list — and «حذف این بازیکن» was on neither, only on the menu those views skip.
- **A failed invite blamed the connection whatever happened.** It now shows the server's own reason,
  which is how the next two findings were found at all.

### The match lock — the day's real bug
**A match locks one hour before `scheduledAt` and the API then refuses every write to it,
invitations included** (api-findings §0e). With `API_SHIFT_MS` storing matches half an hour early,
that lands **90 minutes before the real start**. The user hit the worst shape of it: the match was
created and then *both* its invites were refused, and an invite can only go to a match that already
exists. `isSchedulable` now wants the stored instant more than an hour out, so step ۳ greys those
slots. **When the UTC bug is fixed and `API_SHIFT_MS` goes to 0, the hour in `LOCK_MS` stays.**

### The backend answered three asks, and we found the answers were worth having
- **Both status enums declared** — `MatchStatus OPEN/FINISHED/CANCELLED/AUTO_CANCELLED` and
  `ParticipantStatus CONFIRMED/REQUESTED/REJECTED/LEFT/KICKED`. The guesses held, but the values we
  had never seen exposed two live bugs: **`AUTO_CANCELLED` read as a live match**, and **the match
  card drew every participant as a player**, counting rejected/left/kicked against the capacity.
  `AUTO_CANCELLED` is not theoretical — it is what a match that never fills becomes at kickoff.
- **`InvitationStatus PENDING/ACCEPTED/CANCELLED`** and
  **`JoinChannel OPEN/REQUEST/INVITE_LINK/DIRECT_INVITE`** followed. `INVITE_LINK` is the share-link
  flow, unbuilt — and per the backend's own comment it auto-confirms *regardless of visibility or
  join policy*, which is the thing to think about when building it.
- **Invite suggestions carry `phoneNumber` now**, which unblocked «از بین بازیکنان پچ»: it reads the
  live suggestions and a picked player is invited by phone like a typed one. `accountIds` is still
  400 and no longer matters.

### /activity, built twice in one session
Built on `GET /matches/invitations/me` + one `GET /matches/{id}` per invitation — then the backend
shipped **`GET /api/v1/activity`** (§0h) and it was rebuilt on that the same day. Two sections:
«دعوت‌ها» (answerable) and «مَچ‌های شما» (the feed). **Invitations still need their own call** — the
feed carries only matches you are already in, and accepting is addressed to the invitation id.
Unknown feed `type`s are skipped, not guessed at.
- **There is no invitee-side decline.** `DELETE /matches/invitations/{id}` is the organizer
  cancelling one they sent; the invitee gets 403. A decline button would always fail, so there isn't
  one — «مشاهده مَچ» and «پذیرفتن» only.
- **An invitation outlives its match**: cancelling a match leaves every invitation `PENDING` for ever
  with no sweep, so a raw pending count is not "waiting for you". Cards are drawn only for matches
  still ahead.
- The BottomNav tab was never missing — it was labelled «کاوش» from the mock-feed days. Renamed
  «فعالیت‌ها», and its red dot reads the page's own query (one fetch for both) and counts
  **invitations only**.

### The share link, built last
Sharing a match sent its own URL — a page you could read and not act on. It sends
**`/join/{token}`** now: preview the match, join in one tap, through the API's own invite-token
endpoints (§0j). Neither endpoint is public, so the route is guarded and **`next` carries the link
through login *and* `/profile-setup`** — signing up from an invite still lands on the match. `next`
is honoured only when it is a path on this app.

The preview shows less than the match page deliberately: the API returns **no participants** for a
token, so nothing about who is playing reaches whoever the link was forwarded to. Only the
**organizer's** copy of a match carries an `inviteToken`; `ShareCard` falls back to the match URL for
everyone else. A second open is a 409 that navigates rather than erroring.

**Both bugs the phone found were in one check — "are you already in this match?"** It read the match
by id, which is **404 for an outsider on a `PRIVATE` match** (exactly who holds a share link), and
that reached the app's error screen. Then, fixed to swallow the failure, it **shared the match page's
query key** while resolving `null` — and that `null` was served to the match page, crashing it on
`organizerAccountId`. A probe that can fail needs its own key. Neither was visible from reading the
code; both took a phone and a private match.

### Worth knowing
- **The hour bug looked fixed on 2026-09-20 and is not** (§0i). `+03:30` is accepted now instead of
  400, but the on-the-hour rule still runs on UTC and the server **floors** the rest: Tehran ۱۸:۰۰
  (14:30Z) is stored `14:00Z`, Tehran ۱۸:۳۰ exactly. Every on-the-hour Tehran match silently loses
  half an hour. `API_SHIFT_MS` is unchanged and still right, but it now compensates for truncation
  rather than dodging a rejection — **re-probe before removing it.**
- **`GET /matches` never returns a cancelled match**, so «برگزار نشده» can only reach a details page.
- **Two things that looked like bugs were not**: a player missing from a match page (a stale cache
  after joining on the deployed site, gone on reload), and an empty `/activity` (every invitation had
  been accepted). Check the server's own state before editing — `scripts/api.sh` settled both in a
  minute.
- Probe matches are cancelled, not deleted, and the user cancelled every match on the account while
  testing — an empty `/matches` mid-session was that, not a bug.

### Next
- **Ask the backend:** the hour in `Asia/Tehran` (truncation is not the fix); document the one-hour
  lock and say whether invitations belong behind it; a decline verb for the invitee; declare the
  feed's `type` and `role`; whether invitation rows are coming to the feed (if so, the second call
  goes); invitations orphaned by a cancelled match; `GET /matches/me` 500s (no such route — it
  matches `/matches/{id}` with an unparseable id).
- **The wizard still cannot share the link** — the token only exists once the match is created, so
  «رفتن به مَچ» goes to the match page and the sharing happens there. A share button on the wizard's
  success step is small, and it is the moment an organizer most wants the link.
- Still open: CI, the password-login test account, and the visual leftovers (Neshan `Cache-Control`,
  the dead `bgImage`/`athleteImage` props, the ball behind the first date cell).

## Session — 2026-09-16: create-match goes live, phone invites, and a visual pass
All pushed to both remotes (head `2cd250d`). The match-details collapse from 09-14 was confirmed on
the phone at session start.

- **The UTC-hour bug is still there** (re-probed: `18:00+03:30` → 400, `14:30+03:30` → 201). User
  chose to work around it: **every match is stored 30 minutes early** (`API_SHIFT_MS`,
  `lib/api/matches.ts`) and `matchStartMs` adds it back for every reader — time range, strip day,
  both status clocks. Early, not late, so server-side timing errs before the start. Verified live:
  sent `14:00Z`, read back ۱۸:۰۰. **Any new `scheduledAt` reader goes through those helpers.**
- **`createMatch` posts to the API**; the `matchList` mock is gone. The three matches created before
  the shift now read 30 minutes later than they did.
- **Phone invites are sent** right after create. Probed with the second account (متیوس,
  `09981830972`): a number on Patch resolves to its `inviteeAccountId`, stays `PENDING`, and is not in
  `participants` until accepted. **Invites are phone-only** — `accountIds` → 400 — and
  `/invitations/suggestions` has no phone, so «از بین بازیکنان پچ» can't send. User: keep it
  visible on the mock and wait for the backend.
- **Invite errors show at the button** (user asked): own number and duplicates are refused when
  افزودن/ذخیره is tapped. The own number comes from `patch.phone`, **saved at OTP verify** — no
  endpoint returns it, so a pre-09-16 login lacks it until re-login. Whatever the server still refuses
  is listed by `InviteFailures` in the wizard before رفتن به مَچ; raw i18n keys are translated.
- Pre-push review found two bugs the wiring made live, both fixed: **a failed create was silent**
  (now the server's message above the footer), and **past hours today were pickable** (now
  `isSchedulable` greys them and gates step ۳).

- **Login/OTP redesigned from the user's mockup** — night photos (PATCH wordmark + tagline baked in)
  pinned top via `AuthSlide pinTop`, rounded-square fields/OTP boxes (`rounded-field` 14px), card
  border, phone icon. `body:has(.bg-night)` paints the canvas navy so Android's nav bar isn't white.
  User confirmed all of it on the phone.

- **All five heroes are a photo now** (`CourtBackdrop` → `/images/hero-court.webp`), replacing the
  drawn court. Held at open height and anchored top so the collapse clips instead of re-cropping.
  Around it: `bg-night` fallback, `IconButton` `bg-black/40`, glass `DateCell` `bg-white/85` with a
  `bg-primary` selection and faded past days, filter/sort glyphs from the mockup, collapsed dated hero
  140px (10px gap — 130 looked stuck, 146 too loose). The login canvas rule moved to `.auth-night`.
  Generated in three passes, each an edit of the last; the third re-lit it from night to daylight
  blue (user: the dark photo fought the bright brand blue — keep the palette, change the photo).
  For a replacement, generate at 1536×1024 with the prompt below, then ask for a daylight-blue edit
  keeping the title zone around `#254C7A`:

  > Wide cinematic photograph of an outdoor padel court at night, 3:2 landscape, 1536x1024. A dark
  > matte padel racket leans against the glass-and-mesh side wall in the lower-left, a fluorescent
  > yellow-green padel ball at its base, both inside the left 30% of the width; the top of the handle
  > at ~45% of the height, the bottom of the ball above 75%. Clean regular pattern of round, evenly
  > spaced holes on the racket face. Top-left corner (left 35%, top 38%) calm and dark. Right half,
  > especially 30–60% height, clean and evenly lit: out-of-focus net and fence far back, no lights or
  > hard edges. Top 25% a smooth dark deep-blue sky. Moody premium sports photography, shallow depth
  > of field, monochrome blue (#0A2A5E shadows to #1E6FD9), blue turf; the ball is the only non-blue
  > colour. No text, logos, people, decorative curves, light streaks, lens flares or visible floodlights
  > in the upper half.

### Worth knowing
- **DELETE on a match soft-cancels.**
- **Clearing `.next` under a phone that has the page open** leaves it running old JS against new
  HTML: the phone field showed digits but ادامه never enabled. A reload fixed it — not an app bug. Every probe match this session is `CANCELLED`, not gone.
- **The phone's login is a separate token chain** from `.api-session.json` — testing on the phone
  doesn't kill the terminal session. Only sharing one pair does (see memory). Headless runs wrote the
  rotated pair back and the CLI session survived all three.
- Dev server was started with `next dev -p 3000`; phone URL `http://192.168.1.45:3000`.
- **Invites send real SMS** (unverified for non-Patch numbers). Test only with the two own accounts.

- **Later the same day, visual pass on the list pages** (all from user mockups, checked on the phone):
  date strip — navy selected day with a **lime `accent` (`#C7F000`, the ball)** 1px border + dot,
  past days grey *text* on an opaque cell (opacity let the photo through the digits); the «جاری»
  badge gets the lime dot; filter/sort glyphs; the photo re-lit from night to daylight blue (user:
  keep the bright palette, change the photo). Match cards: club added to the meta row (centred),
  chevron CTA, 16px page gutters, 12px between cards.
- **Tried and reverted by the user:** a subtitle under «مچ‌های روز»; a compact card that swapped the
  player grid for an organizer byline; the mockup's navy CTA (declined up front — brand blue stays).

### Next
- **Ask backend:** invite by `accountIds`; Persian `failureMessage` instead of raw keys; the UTC-hour
  fix (then `API_SHIFT_MS` → 0 plus a migration of shifted matches).
- Test the wizard end to end on the phone (the headless runs seeded drafts rather than tapping through
  all five steps).
- Still open from before: share-link flow, `GET /matches/invitations/me` for `/activity`, CI, the
  password-login test account.

## Session — 2026-09-14 (pm): the date strip stops being a prop
One commit on `main`. The header calendar on `/matches` and `/tournaments` was mock and had been
since it was built.

- **It was seven hardcoded cells** — ۱۵–۲۱ بهمن in `lib/mock/index.ts`, two flagged `past`, and both
  pages pinned `useState("d17")`. The dates never moved with the clock and tapping one narrowed
  nothing. `dayStrip(back, forward)` in `lib/jalali.ts` builds it from `todayISO`/`addDaysISO`/
  `isoToJalali` — the conversion the wizard's calendar already had, so no new date code.
- **Selecting a day filters now.** `MatchListItem.day` is the match's **Tehran** calendar date via
  `tehranDateISO`, the same +3:30 shift as `tehranTimeRange`. The shift is not cosmetic: a 02:00
  Tehran match is 22:30Z the day before, and the UTC date would file it one cell early.
- **The live data drove two decisions.** The four seeded matches are ۰۲/۰۳/۰۴/۱۰ مهر (09-24, 09-25,
  09-26, 10-02) — none today, and the last one **18 days out**. So the window went from a fortnight
  to today−2 → today+30 (it had been unreachable), and **no day is selected on open** (user
  decision): the strip narrows only when tapped, re-tapping clears, and `/matches` opens showing all
  four instead of an empty "today". Flipping the default to today is one line when volume justifies it.
- `/tournaments` gets real dates but stays cosmetic — `TournamentListItem` carries only a
  pre-formatted Persian range, so a cell has nothing to match against.

Also this session, from a report that the wizard's club switch felt broken:
- **The court map was painting the previous club for ~2s.** Not latency — an `<img>` holds its old
  pixels until the new `src` decodes, so the tap looked ignored. `CourtMap` hides the image until it
  loads and pulses a placeholder instead. The round trip is unchanged; the ambiguity is gone.
- **And `mapFailed` never reset** — a boolean carried one club's failure onto every club picked after
  it. Both flags are keyed to their `src` now. Deferred: a `Cache-Control` on `/map/static` so a
  revisited club is instant (TODO — needs Neshan's current headers looked at first).

- **`/matches/[id]`'s hero collapses now**, the last static one. Same `useCollapseHeader` +
  `.hero-collapse` + `.hero-page` pieces as the list pages, reusing `.hero-collapse-actions` for the
  back button and `.hero-collapse-title` (fixed `--title-open: 32px` — the match name is user data).
  One new rule, `.hero-collapse-pills`: the share/edit pills ride the bottom edge up into the back
  button, so they go to **zero scale** by `--collapse` 0.45 — opacity 0 alone stays hit-testable and
  an invisible pill would swallow the tap meant for برگشت. **Not verified on a device** (see below).

### Worth knowing
- **The dev server was `next start`, not `next dev`.** Three changes looked broken on the phone
  because nothing had been compiled since before the session — no HMR on a production server. Check
  `ps -eo args | grep next` before diagnosing "my change isn't showing"; the served CSS chunk is the
  other tell (`curl` the chunk and grep for the new class). The server was restarted on a clean
  build; note `.next` is a **mountpoint** (`/dev/nvme0n1p2`), so clear its contents, don't `rm -rf` it.
- **The stored API session had expired** (`توکن رفرش نامعتبر`) and cost an SMS to restore. This is the
  second session in a row it has; the password-login test account below is the fix, not a habit.
- **Guessing would have shipped this wrong.** The fortnight window and the default-to-today both
  looked fine until the real `scheduledAt` values were on screen. One authenticated GET decided both.

### Next
- **Verify the match-details collapse on the phone** — it was committed unseen at session close. The
  part to check is that **برگشت still works once the bar is collapsed**: the pills land where the
  back button ends up, and the zero-scale rule is what keeps them from eating the tap. Reasoned, not
  observed.

The 2026-09-12/14 list below still stands unchanged — «از بین بازیکنان پچ», the share-link flow,
`GET /matches/invitations/me`, CI, and the password-login account. One item added by this session:
- FilterSheet's **تاریخ facet (امروز/این هفته/این ماه) is now computable** from `MatchListItem.day`.
  Left unwired deliberately — the strip already picks a day, so decide whether the facet earns its
  place beside it before building it.

## Session — 2026-09-12/14: onboarding parked, maps, the auth keyboard, and the API
18 commits, all pushed to **both** remotes (head `b77f9db`). Everything below is on `main`.

### What shipped
- **Onboarding is parked, not deleted** — `app/(auth)/_onboarding/`. The leading `_` makes it a Next
  private folder: no route, still compiled. Nothing linked to it. Reviving it is a folder rename.
- **Court maps are real** — Neshan static maps at the club's own coordinates, behind a `/map/static`
  rewrite so `NESHAN_API_KEY` stays server-side. مسیریابی opens the Neshan app via `nshn.ir`. The
  API had been sending `latitude`/`longitude` all along; `lib/data/matches.ts` was dropping them.
- **The auth keyboard, fixed on a real Android phone** — four bugs, all in `97d06af`. The blank band
  under the card (`AuthSlide` art is `fixed`, not `absolute`), the per-keystroke drop (`AppScroll`
  writes `--vvh` asymmetrically — shrink immediately, growth after 150ms), and two OTP input bugs.
  `scripts/otp-webkit.mjs` is 12 cases now.
- **The API is wired much further**: matches list, match details, join requests, viewer role/stage,
  and the join/leave/cancel CTAs — which had all been inert buttons.

### The two things that are still blocked, and why
- **`POST /matches` cannot be wired.** `scheduledAt` is validated "on the hour" against **UTC**
  minutes and Iran is +03:30, so no Tehran wall-clock hour is ever accepted. The mapping is written
  and tested (`lib/api/matches.ts`, `matches.test.ts`) and needs **no change** when the server
  validates in `Asia/Tehran`. Reported to the backend 2026-09-13; re-probed 09-14, still broken.
- **رقابتی is greyed out** — `matchType: COMPETITIVE` returns 400. One flag: `COMPETITIVE_ENABLED`
  in `StepDetails.tsx`.
- Full evidence and the consolidated ask: `_designer/api-findings.md` §0–§0d.

### Traps worth not re-learning
- **The API session cannot be shared.** Refresh tokens rotate, so the CLI file and a headless
  browser invalidate each other — and a second browser run invalidates the first. Symptom is a
  silent redirect to `/login`, which reads like a code bug. One browser run per login; do all
  `scripts/api.sh` probing first. Each wasted session costs the user an OTP.
- **`next build` over a running `next start` corrupts it** — 500s with an empty body. Stop the
  server (by pid from `ss -lptn 'sport = :3000'`) before rebuilding.
- **`next dev` + a WebKit instance exhausts this machine's RAM** — the dev server was killed six
  times. Use `next build && next start` for headless checks; it was ready in 195ms and survived.
- **Three id spaces.** `PlayerResponse.id` (player), JWT `sub` (account, via `getAccountId()`), and
  `MatchParticipantResponse.id` (participant). Match ownership uses the *account* id; approve/reject
  is addressed to the *participant* id. Comparing the wrong pair fails silently.
- **Undeclared enums.** Match `status` and participant `status` are bare strings in the spec. Only
  `CANCELLED`, `OPEN`, `CONFIRMED` and `REQUESTED` have been observed — the latter learned by having
  a second account join a `MANUAL_APPROVE` match. Everything else is derived from the clock so an
  undocumented value cannot mislabel a card.

### Next
- **«از بین بازیکنان پچ» is a promise the code does not keep** — the copy says «کسانی که قبلاً با
  آن‌ها بازی کرده‌اید» but `getPickablePlayers` returns the mock. `GET /matches/invitations/suggestions`
  exists; check what it is actually sorted by before trusting the label.
- Then: the share-link flow (`GET /matches/invite/{token}`, `ShareCard` already exists and
  `inviteToken` arrives on every match), and `GET /matches/invitations/me` for `/activity`.
- **CI has never run.** `patch-server-runner` shows `Last contact: Never`, so nothing has deployed —
  `app.patchapp.ir` is still serving a pre-2026-09-12 build. Needs Parsa.
- Ask the backend for a **password-login test account** (`/auth/admin/login` exists); OTP-only
  re-auth is what makes every headless check cost the user a text message.
- Four seeded test matches and one pending join request are live in the production database, kept
  deliberately so the list is not empty. Delete with `DELETE /matches/{id}` (soft).

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
