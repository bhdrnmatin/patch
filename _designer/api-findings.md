# API findings — live probe, 2026-08-24

Probed `https://api.patchapp.ir` (spec: `GET /v3/api-docs`, unauthenticated) with a real
player token via `scripts/api.sh`. 34 endpoints, all but the admin ones exercised —
including a full create → invite → join → delete cycle against real clubs.

The API was **redeployed three times during the session**, so this is a moving target.
Findings below are as of the last pass; re-run before trusting any of it.

**Re-probed 2026-08-27.** The OpenAPI spec is byte-identical in shape (32 paths, same
schemas), but the create-match error handler has been rewritten — see #3. Everything else
below was re-verified unchanged.

## Fixed so far

- **Create-match errors now name the field** (2026-08-27) — mostly; see #3.
- **Participants and the organizer are named** (2026-08-25) — see #1.
- **`username` no longer breaks signup.** It was required on `PUT /players/me/profile`
  while the app had stopped sending it (`lib/api/types.ts:31`), so every profile save
  400'd and no new user could complete onboarding. It is now optional, and omitting it
  **preserves** the existing value rather than nulling it. The app needs no change.
- **Participants are readable.** `MatchResponse` now embeds `participants[]`, each with
  `photoUrl`. Roster, `filled` count and the pending-requests list are all derivable
  from `GET /matches/{id}`.
- **Clubs are seeded** — 5 ACTIVE clubs, all in one city (Karaj/البرز), each with
  `latitude`/`longitude` and a contact phone.

## Blockers

### 0. `scheduledAt` cannot express any Tehran hour — **create-match is blocked on this**
Probed 2026-09-12 against the live API. `scheduledAt` is parsed as a `java.time.Instant`
and the "on the hour" rule is applied to the **UTC** minutes:

| Sent | Result |
|---|---|
| `2026-09-20T11:00:00Z` | ✅ 201 |
| `2026-09-20T18:00:00+03:30` (Tehran ۱۸:۰۰, = 14:30Z) | ❌ 400 `زمان شروع مچ باید دقیقاً روی ساعت باشد` |
| `2026-09-20T14:30:00+03:30` (Tehran ۱۴:۳۰, = 11:00Z) | ✅ 201, stored `11:00:00Z` |
| `2026-09-20T18:00:00` (no offset) | ❌ 400 `validation.invalidFormat … java.time.Instant` |

**Re-probed 2026-09-16: unchanged.** `2026-09-25T18:00:00+03:30` → 400, `14:30+03:30` → 201 (stored
`11:00:00Z`). The probe match was DELETEd, which soft-cancels (`status: CANCELLED`), not removes.

**Iran is UTC+03:30, so no Tehran wall-clock hour ever has zero UTC minutes.** Every slot
the wizard offers (۰۸:۰۰ … ۲۴:۰۰, all on the hour — `StepSchedule.tsx:23`) is rejected, and
the only times that *are* accepted read as half-past to a user. Courts are booked on the
hour, so the accepted set is exactly the set nobody wants.

**Ask:** validate the hour in the club's local timezone (`Asia/Tehran`), not UTC. The app
already sends the offset, so `18:00+03:30` should be accepted unchanged and no client
change is needed once this lands.

**Re-probed 2026-09-22 — the rejection is gone and the bug is not.** The "on the hour" rule no
longer 400s; the server **truncates to the UTC hour** and accepts everything:

| Sent | Stored |
|---|---|
| `2026-09-27T18:00:00+03:30` (Tehran ۱۸:۰۰ = 14:30Z) | `14:00Z` — Tehran ۱۷:۳۰ |
| `2026-09-27T20:00:00+03:30` (16:30Z) | `16:00Z` — Tehran ۱۹:۳۰ |
| `2026-09-27T12:59:00Z` | `12:00Z` |
| `2026-09-27T12:20:00Z` | `12:00Z` |

Iran is +03:30, so **every Tehran hour loses 30 minutes**, silently — and a wrong minute is now
swallowed rather than refused, which is worse for any client that trusts the field.

**This makes `API_SHIFT_MS` load-bearing, not a workaround to retire.** The app sends Tehran ۱۸:۰۰
as `14:00Z` and adds the 30 back on read — and `14:00Z` is *exactly* what truncating the honest
`14:30Z` produces, so the stored row is the same either way and only our reader interprets it
correctly. Set the shift to 0 and the app would show every match 30 minutes early. Everything
else that reads the instant — reminders, an admin panel, a second client — is already 30 early.

**Ask stands, reworded:** floor and validate in `Asia/Tehran`, not UTC.

**Worked around 2026-09-16 (user decision), create-match is live.** Every match is stored
30 minutes *early* — Tehran ۱۸:۰۰ goes up as `14:00Z` — and every reader adds it back
through `matchStartMs` (`API_SHIFT_MS` in `lib/api/matches.ts`). Verified with a real
create: `14:00Z` → 201, reads back ۱۸:۰۰. When the backend fix ships, set the shift to 0,
and deal with the matches stored under it: they will read half an hour early.

### 0b. رقابتی is refused outright
`matchType: COMPETITIVE` → 400 `مسابقات رقابتی هنوز فعال نشده‌اند`, matching the spec's
`Only FRIENDLY is accepted in this MVP`. Since the wizard's رقابتی maps to it, the option
is greyed out in step ۱ behind `COMPETITIVE_ENABLED` (`StepDetails.tsx`) rather than
letting someone fill five steps to be turned away. Flip that one flag when it's enabled.

### 0j. The share link — probed while building it, 2026-09-20
`GET /matches/invite/{token}` previews, `POST /matches/invite/{token}/join` joins, and
`POST /matches/{id}/invite-token/regenerate` rotates the token.

- **Neither is public.** Both answer 401 without a session, so `/join/[token]` is a guarded
  route and the login it bounces through carries a `next` back to the link. A brand-new
  account signs up and still lands on the match.
- **The preview carries no participants** — `participants: []` even when the match has some.
  Nothing about who is playing leaks to whoever the link is forwarded to. It also means the
  preview cannot say whether *you* are in the match already.
- **`GET /matches/{id}` is 404 for an outsider on a `PRIVATE` match**, which is exactly who
  holds a share link. Anything that reads the match by id on that path must treat the failure
  as "not a member", not as an error.
- **Only the organizer gets a token**: `inviteToken` is `null` in everyone else's copy of the
  match, so a player cannot hand out a working link. `ShareCard` falls back to the match URL.
- **Joining twice is 409** «شما قبلاً در این مچ عضو شده‌اید», and previewing does **not** join
  (probed: a match with `organizerJoins: false`, 0 participants before and after a preview).
- **A `PRIVATE` match can only be `INVITE_LINK_ONLY`** — private + `MANUAL_APPROVE` is refused
  with «مچ خصوصی فقط می‌تواند نحوه‌ی ورود «فقط با لینک دعوت» داشته باشد».
- The link auto-confirms **regardless of visibility or join policy** (the backend's own words),
  so forwarding it is the same as adding a player. That is the feature, but it is the thing to
  weigh before putting the link anywhere public.

### 0h. `GET /api/v1/activity` — the feed, shipped 2026-09-20
Paged (`page`/`size`), rows of `{type, referenceId, relevantAt, detail}`, ordered by
`relevantAt`. `type` and `detail` are a bare string and an untyped object in the spec; only
**`MATCH`** has been seen, and its detail is `{role, match}` with the **whole `MatchResponse`
embedded**, participants and organizer included.

It replaced the N+1 the page was built on. Two things it does not do, so the invitations
endpoint stays beside it:
- **No invitation rows** — the feed carries matches you are already in, so an unanswered
  invitation is not in it.
- **Accepting needs the invitation id**, which only `GET /matches/invitations/me` gives.

Unknown `type`s are skipped rather than guessed at. **Ask:** declare `type` and `role` (only
`ORGANIZER` observed, from an account that organises everything), and say whether invitations
are ever coming into the feed — if they are, the page drops its second call.

### 0i. The hour bug is not fixed, it is silent — re-probed 2026-09-20
`+03:30` times are accepted now instead of 400, but the "on the hour" rule still runs on UTC
and the server **floors** anything else:

| Sent | Stored |
|---|---|
| `2026-09-26T18:00:00+03:30` (Tehran ۱۸:۰۰ = 14:30Z) | `14:00:00Z` — **30 minutes early** |
| `2026-09-26T18:30:00+03:30` (= 15:00Z) | `15:00:00Z` — exact |
| `2026-09-26T20:00:00+03:30` (= 16:30Z) | `16:00:00Z` — **30 minutes early** |
| `2026-09-26T14:30:00Z` | `14:00:00Z` |

So every on-the-hour Tehran match silently loses half an hour, with nothing to say so. **This
is worse than the 400**, which at least announced itself. `API_SHIFT_MS` is unchanged and
still correct — the wizard sends the floored instant itself and every reader adds it back —
but it now compensates for truncation rather than dodging a rejection.

**Ask again:** evaluate the hour in `Asia/Tehran`. A user who picks ۱۸:۰۰ has a match stored
at ۱۷:۳۰ today.

### 0f. Invite suggestions carry a phone now — 2026-09-19
`GET /matches/invitations/suggestions` returns `{accountId, firstName, lastName, photoUrl,
phoneNumber}`. The phone is new (absent 2026-09-16) and it unblocks the wizard's
«از بین بازیکنان پچ», which could previously show people it had no way to invite, since
`POST /matches/{id}/invitations` takes `phoneNumbers` only.

`accountIds` is **still refused** — re-probed 2026-09-19, both `accountIds` and
`inviteeAccountIds` answer 400 `phoneNumbers: must not be empty`. Worth fixing anyway: the
client now holds other players' phone numbers only to name people the server already knows.

The list is short and can be empty (one entry on the test account), so it reads as
"people you have played with" rather than a directory — which is what the design asks for.

### 0g. Invitations: the invitee can accept, and nothing else — 2026-09-19
Wiring `/activity` to `GET /matches/invitations/me` turned up four undocumented things,
three of them on a phone:

- **There is no invitee-side decline.** `DELETE /matches/invitations/{id}` is the *organizer*
  cancelling an invitation they sent; the invitee gets 403 «شما برگذار کننده این مچ نیستید».
  So an unwanted invitation stays in their list forever. The card offers «مشاهده مَچ» and
  «پذیرفتن» only — a decline button would be one that always fails. **Ask for the verb.**
- **Joining a match closes its invitation.** Answer the card afterwards and the API says 409
  «این دعوت‌نامه قبلاً پذیرفته شده است», though the person never touched the invite. The page
  refetches on any error, so a card the server has closed drops itself.
- **`joinChannel: DIRECT_INVITE`** is what accepting produces. A plain join after an invite
  still reads `OPEN`.
- **Both enums were declared the same day** (asked, answered):
  `InvitationStatus  PENDING, ACCEPTED, CANCELLED` and
  `JoinChannel  OPEN, REQUEST, INVITE_LINK, DIRECT_INVITE`. Types in `lib/api/types.ts`;
  every guess held. `INVITE_LINK` is the share-link flow the app has not built — it is the
  value to look for when it is.
- **An invitation outlives its match.** Cancelling a match leaves every invitation to it
  `PENDING` for ever — there is no sweep — so a raw `PENDING` count is not "invitations
  waiting for you". `/activity` drops any whose match is not still upcoming.

**Still an ask:** give the invitee a way to say no. (The enums were answered 2026-09-19.)

**Shape cost:** the response carries `matchId` and nothing else about the match, so the page
spends one `GET /matches/{id}` per pending invitation to name it. Fine at this size; a batch
or an expanded response is the fix if a player can ever have many.

### 0e. A match locks an hour before `scheduledAt` — probed 2026-09-19
Every write touching a match is refused from one hour before its `scheduledAt`:
`زمان قفل این مچ فرارسیده و دیگر هیچ تغییری ممکن نیست`. Confirmed on both `POST /matches`
(at 07:41Z an `08:00:00Z` match is refused, `09:00:00Z` is created) and
`POST /matches/{id}/invitations`. The lock is undocumented — nothing in the spec mentions it.

**It bites the wizard twice over**, because the stored instant is `API_SHIFT_MS` early:
a Tehran ۱۲:۰۰ slot is stored `08:00Z`, so it locks at `07:00Z` — **90 minutes before the
match really starts**. Reported from the phone on 2026-09-19: the match was created and
then *both* its invites came back failed, which is the worst shape this can take, since
invites can only be sent to a match that already exists.

`isSchedulable()` now requires the stored instant to be more than an hour out, so step ۳
greys those slots. **When the UTC-hour bug is fixed and `API_SHIFT_MS` goes to 0, the lock
stays** — keep the hour in `LOCK_MS`.

**Ask:** confirm the lock window is intended at one hour, and document it. Inviting someone
to a match that has not started doesn't obviously belong behind the same gate as editing it.

### 0d. Both status enums — **declared by the backend 2026-09-19**
`MatchParticipantResponse.status` and `joinChannel` are both `"type": "string"` with no enum.
Resolved by experiment on 2026-09-14 with a second account joining a `MANUAL_APPROVE` match:

| situation | `status` | `joinChannel` |
|---|---|---|
| organizer, `organizerJoins` default | `CONFIRMED` | `OPEN` |
| someone who asked to join, awaiting approval | **`REQUESTED`** | **`REQUEST`** |

Join requests are wired on that basis: `filled` counts `CONFIRMED`, `requests` are the
`REQUESTED` rows, and approve/reject post to
`/matches/{id}/participants/{participantId}/approve|reject`.

**Answered 2026-09-19.** The backend gave both enums:

```
MatchStatus        OPEN, FINISHED, CANCELLED, AUTO_CANCELLED
ParticipantStatus  CONFIRMED, REQUESTED, REJECTED, LEFT, KICKED
```

Both are types in `lib/api/types.ts` now, and the guesses held — CONFIRMED is the roster,
REQUESTED is the door, and the three we had never seen are all "not in the match".

Two things the enum changed, both fixed the same day:
- **`AUTO_CANCELLED` was read as a live match.** Only `CANCELLED` was trusted by name, so a
  match the server cancelled itself kept its «جاری» badge and a CTA to join.
- **The list card drew every participant as a player.** `toListItem` mapped the rows
  unfiltered while the details page filtered to CONFIRMED, so a rejected, departed or removed
  person appeared on the card and counted against capacity. Now both filter.

`MatchStatus` has **no LIVE**: a match in progress is still OPEN, so live-vs-upcoming stays
arithmetic on `scheduledAt + durationHours`. `FINISHED` is trusted when it's set.

`joinChannel` is still an undeclared string (`OPEN`, `REQUEST` observed) — nothing reads it.

**Observed 2026-09-19, both worth knowing:**
- **`GET /matches` never returns a cancelled match.** Cancelling one removes it from the list
  outright (confirmed by cancelling every match on the account — `totalElements: 0`, while each
  one still answers by id). So `toStatus`'s `not-held` can only ever come from a details page;
  no card will carry «برگزار نشده».
- **`AUTO_CANCELLED` is what a match that didn't fill becomes.** «راکت طلایی» — one confirmed
  player — holds it after its start time passed. Nothing asks for it; the server decides.

**Also:** `participants[].photoUrl` is a **presigned S3 URL** with `X-Amz-*` query parameters,
so it expires. Fine to render immediately; do not cache or persist one.

### 0c. Re-confirmed 2026-09-12
- **A missing `title` still 500s** — unchanged since 2026-08-24. The wizard treats the
  title as اختیاری, so `draftToCreateRequest` always invents one («مچ ۲۹ شهریور»).
- `capacity` minimum is **4**, and the wizard has no capacity concept for دوستانه/آمریکانو,
  so the mapping floors the roster size at 4.
- Field-level errors are good now: `loc` is named and the message is Persian for
  `matchType`, `scheduledAt` and `clubId`.


### 1. Identity — mostly fixed, two gaps left
**Fixed 2026-08-25.** `MatchParticipantResponse` gained `firstName`/`lastName`, and
`organizerAccountId` was replaced by a nested `organizer` object
(`MatchOrganizerResponse { accountId, photoUrl, firstName, lastName }`) — a breaking
change, but nothing of ours was wired to it. Verified live: the roster and the organizer
both come back named. `MatchDetails.creator`, the players grid, and the approve/reject
rows can all be filled now.

Still missing:
- **No player lookup or search.** `GET /players/{id}` 404s for both the account id and
  the player id, and there is no list or search endpoint. The two id spaces still differ
  (JWT `sub` is an account id; `/players/me` returns a different player id). So the create
  wizard's "add a Patch player" teammate flow has **no backing endpoint** — until one
  exists, only phone invites can work in step ۴.
- **No organizer-side invitation list.** `POST /matches/{id}/invitations` creates them and
  `GET /matches/invitations/me` serves the *invitee*, but `GET /matches/{id}/invitations`
  is 405. An invited phone does **not** appear in `participants` until it accepts, and
  `MatchResponse` carries no invitation field, so a creator cannot see who they invited.
  The server clearly holds the state — a repeat invite is refused as `alreadyInvited` — it
  is simply not exposed. There is also no way to cancel or resend one.

  This is worse than a missing list, because the design has no pending state to fall back
  on: `PlayerSlotButton` renders either a filled chip or a dashed **+ افزودن بازیکن**, so an
  invited-but-unaccepted teammate is indistinguishable from an empty slot. The creator taps
  it, re-invites the same person, and gets `matchmaking.invite.alreadyInvited` with nothing
  on screen explaining why. Note the wizard *does* model this — `StepReview.tsx:80` gives an
  invited teammate the role **دعوت‌شده** — but that lives only in the local draft and is lost
  the moment the match is saved.

- **Some invite failures return raw i18n keys.** `failureMessage` is designed to be shown to
  the user and is Persian for a bad number (`شماره موبایل «…» معتبر نیست`), but a duplicate
  or self-invite returns `matchmaking.invite.alreadyInvited` /
  `matchmaking.invite.alreadyParticipant` untranslated.
- `firstName` still carries its untrimmed trailing space (`"متین "`), which now renders
  wherever the roster does.

### 2. `POST /matches` — three fields are required but not declared
Only `format`, `matchType`, `clubId`, `scheduledAt`, `visibility`, `joinPolicy` are
marked required, but a body with exactly those **400s**. Determined by bisection:

| Field | Spec | Actual |
|---|---|---|
| `title` | optional | **required — omitting it returns `500`, not a validation error** |
| `capacity` | optional | **required** (400 without) |
| `durationHours` | optional | **required** (400 without) |
| `description`, `courtLabel` | optional | genuinely optional ✓ |

All three `format` values × both `matchType`s × all three `joinPolicy`s work once those
are supplied.

Checked against the wizard (2026-08-24) — only one of the three is genuinely required:

| Field | App | Verdict |
|---|---|---|
| `durationHours` | always set (۶۰/۱۲۰ in step ۳) | ✅ correctly required — declare it |
| `title` | **اختیاری by design** (`StepDetails.tsx:77`; step ۱ gates on format + invite only, `page.tsx:43`) | ❌ **API must accept its absence** — today it 500s |
| `capacity` | **no such concept** — رقابتی caps the roster at 4 via `MAX_TEAMMATES`, دوستانه/آمریکانو are deliberately uncapped (`StepPlayers.tsx:47`) | ❌ **must be nullable** |

`lib/data/mutations.ts` already fudges capacity as `format === "competitive" ? 4 :
players.length`, with a comment conceding the roster size is "the only capacity we can
claim." An uncapped match is a real state the API can't currently express.

So: annotate `durationHours` as required, and make `title` and `capacity` genuinely
optional — a missing `title` must not 500.

### 2b. `durationHours` can't express 90 minutes, and truncates silently
```
durationHours: 0     → 400        durationHours: 1.5  → 201, stored as 1
durationHours: -1    → 400        durationHours: 99   → 201  (no upper bound)
```
Hours are the right unit — a match is booked by the hour, so there is no half-hour
duration to express (user, 2026-08-28). The wizard's ۶۰/۱۲۰ map onto 1/2 exactly. What
remains is that 1.5 is *silently truncated* rather than rejected.

**Ask:** reject non-integers instead of truncating, and add an upper bound — a 99-hour
match is accepted.

### 3. Create-match validation errors — fixed except for missing fields
**Largely fixed 2026-08-27.** `details[]` now carries a `loc` and a message, and the
envelope gained `parameters`/`extraInfo`:

| Body | Response |
|---|---|
| `format: "NOPE"` | ✅ `loc: "format"`, `فرمت مسابقه «NOPE» معتبر نیست` |
| unknown `clubId` | ✅ `loc: "clubId"`, `باشگاه انتخاب‌شده یافت نشد` |
| `scheduledAt` in the past | ⚠️ `loc: "scheduledAt"`, raw English `must be a future date` |
| `durationHours: 0` | ⚠️ `loc: "durationHours"`, raw English `must be greater than or equal to 1` |
| **missing `capacity` / `durationHours`** | ❌ still `{"loc":null,"type":null}`, `errorMessage: null` |
| **missing `title`** | ❌ still `500` |

So the wizard can highlight a bad value but still not a missing one — the `@NotNull` path
never reaches the new handler. The two rows marked ⚠️ are bean-validation defaults leaking
through untranslated, the same way `PUT /players/me/profile` does.

Also new (undocumented): **`scheduledAt` must be in the future.** Reasonable, but the
wizard needs to know — a match scheduled for earlier today is rejected.

Other endpoints for comparison:
| Endpoint | Behaviour |
|---|---|
| `POST /matches/{id}/invitations` | ✅ per-phone `success`/`failureMessage`, Persian |
| `PUT /players/me/display-info` | ✅ field-level Persian |
| `POST /matches/{id}/join` | ✅ `409 شما قبلاً در این مچ عضو شده‌اید` |
| `PUT /players/me/profile` | ⚠️ field-level but **raw English**: `must match "^[a-zA-Z0-9_]{3,20}$"` |
| `POST /matches` | ⚠️ named for bad values, null for missing ones |

## Bugs

### 500s on unparseable ids — one root cause, every controller
An id that `UUID.fromString` cannot parse throws past the exception handlers and 500s.
It is not per-endpoint — the same input 500s on every controller, so **one handler for
`MethodArgumentTypeMismatchException` fixes all of them**:
```
GET  /matches/abc              -> 500      GET /clubs/abc            -> 500
GET  /matches/invite/nope      -> 500      GET /provinces/abc/cities -> 500
GET  /clubs?cityId=abc         -> 500      POST /matches/abc/join    -> 500
```
The boundary is Java's lenient `UUID.fromString`, which is why the failure looks
inconsistent from outside:
```
6b5234b2-13c2-41ab-9e7b-9bd6053e566   -> 404   short group still parses, to another UUID
6b5234b2-13c2-41ab-9e7b-9bd6053e566dX -> 500   unparseable
6B5234B2-...-566D                     -> 200   case-insensitive
```
The invite-token case is the user-facing one: invite links are pasted by hand, so a
truncated or mistyped link crashes instead of showing a "link not found" page.

### Smaller
- `firstName` stores as `"متین "` — trailing whitespace is not trimmed.
- No profile-photo delete; upload is one-way.
- `preferredSide` is undocumented in the spec (bare `string`); actual values are
  `RIGHT`/`LEFT`, case-insensitive.
- `participants` is `null` on the create response but populated on `GET` — the create
  response should return the organizer it just added.

## Confirmed behaviour
- Phone format is `09…`, not `+98…`. `gender` is `MALE`/`FEMALE`, accepts lowercase.
- `profileCompletionStatus` / `profileStatus`: `COMPLETE` / `INCOMPLETE`.
- `null` on `display-info` clears a field.
- Access-token TTL is 15 min. Refresh tokens **rotate and the old one dies immediately** —
  `lib/api/client.ts`'s single-flight refresh is the correct design; a concurrent refresh
  kills the session.
- JWT claims are only `iss/sub/exp/iat` — no role or name, so nothing about the user is
  readable client-side without `/players/me`.
- Creating a match auto-adds the organizer as a `CONFIRMED` participant
  (`joinChannel: OPEN`). Match `status` starts `SCHEDULED`.
- `inviteToken` is returned on create and on `GET /matches/{id}`, but is `null` in the
  list response — sensible, but undocumented.
- Inviting an unregistered phone number **auto-provisions an account** and returns a
  `PENDING` invitation for it.
- **`DELETE /matches/{id}` is a soft delete.** It sets `status: CANCELLED`; the match stays
  readable by id *and by invite token*, disappears from the list, and further `join` or
  `delete` calls return 409. Sensible, but the app must handle a `CANCELLED` match arriving
  from a saved link or a stale id — it is not a 404.
- Location data is real: 31 provinces, 1449 cities. But there is no `GET /cities/{id}`,
  and `/players/me` returns only `residenceCityId`, so resolving one id to a name costs
  up to 31 requests. Tracked as `ponytail:` debt at
  `app/profile/edit/personal/page.tsx:57` — the city picker starts blank even when set.

## Model mismatches with the app
- **برگزار کننده (مربی) cannot be expressed.** The API knows one organizer:
  `organizerAccountId`, set from the authenticated caller on `POST /matches` and
  auto-added as a `CONFIRMED` participant. The app separates that from a *role* — step ۴'s
  نقش شما toggle (`draft.myRole`) lets a player-creator hand برگزار کننده to a teammate
  (`draft.coach`, `lib/types.ts:205-214`). `CreateMatchRequest` has no field for either, so
  that choice is silently dropped and the match reads back with the creator as organizer.
  Note the vocabulary trap when raising this: the API's "organizer" is the app's **creator**
  (`ViewerRole`, `app/matches/[id]/page.tsx:43`), *not* برگزار کننده.
- The create wizard has one axis (`americano | friendly | competitive`); the API has two:
  `format` (`OPEN_MATCH|AMERICANO|MEXICANO`) × `matchType` (`FRIENDLY|COMPETITIVE`).
  Mapping undecided.
- **No fee/price and no skill level** anywhere in the API, though `MatchListItem` and
  `MatchDetails` carry `price`, `avgLevel` and `restriction`.
- `CourtOption` has no coordinates, but clubs carry `latitude`/`longitude` — enough to
  implement the "sort by مسافت" control that TODO.md lists as dead.

## Not covered
All admin endpoints (no credentials), `POST /players/me/profile-photo` (skipped —
irreversible, no delete endpoint), club banner/logo upload, `invite/{token}/join` and
participant approve/reject (need a second account).

---

# Endpoint inventory + destructive probe — 2026-09-22

Spec re-fetched (`GET /v3/api-docs`, unauthenticated): **37 paths / 39 operations**, up from
34. Probed with a **fresh account** (`09379137806`, `0e824d38…`) — it signed up empty, so
`PUT /players/me/profile` was called once to make it match-capable (تست پچ, MALE, کرج). Every
write below was on its own throwaway match, which was deleted at the end.

## The app calls 27 of the 39. The 12 it doesn't:

| Endpoint | Verdict |
|---|---|
| `PUT /players/me/visibility` | **works, not wanted** — out of MVP, all profiles public |
| `PUT /players/me/profile-photo/visibility` | still write-only; `PlayerResponse` has no photo-visibility field |
| `DELETE /matches/{id}/participants/{participantId}` (`kick`) | exists, **unbuilt** — organizer can't remove a player |
| `POST /matches/{id}/invite-token/regenerate` | exists, **unbuilt** — no way to revoke a leaked link |
| `DELETE /matches/invitations/{invitationId}` (`cancelInvitation`) | exists, **unbuilt** — organizer can't withdraw an invite |
| `POST /auth/logout-all` | exists, unbuilt — `LogoutRow` ends this session only |
| `GET /clubs/{id}` | works; returns a row identical to the list entry, so no reason to call it |
| `POST /clubs/{id}/logo`, `/banner` | club-owner uploads, no owner UI |
| 4 × admin (`/admin/clubs*`, `/auth/admin/login`) | another app's surface; `scripts/api.sh` uses the login |

## What the probe established

- **`profileVisibility` round-trips.** `GET /players/me` returns it; `PUT /players/me/visibility`
  answers 200 with the **whole updated `PlayerResponse`**, so it could `setQueryData(["me"], …)`
  like the profile PUTs. Parked by the user, not by the API.
- **`regenerate` is a real revoke.** New `inviteToken` in a full `MatchResponse`, and the old
  token then **404s** — but with `مچ یافت نشد`, so a revoked link reads as "no such match".
- **`cancelInvitation` works for the organizer** — 200, invitation comes back `status: CANCELLED`
  (soft, like a match delete). It did *not* free the phone at 12:00 — a re-invite answered
  `matchmaking.invite.alreadyInvited` — and **the backend fixed that the same day**: re-probed
  14:15 on a fresh match, cancel → re-invite returns a new `PENDING` invitation. The duplicate
  guard that matters is still there: inviting a number that already has a **PENDING** invitation
  is refused with the same key. Nothing to ask for.
- **`kick` refuses the organizer**, by design and with good copy: 403
  `برگزارکننده نمی‌تواند خودش را از مچ حذف کند؛ به‌جای آن مچ را لغو کنید`. Kicking a *real*
  participant is **still unverified** — it needs a second account to accept first.
- **A match with `profileStatus: INCOMPLETE` can't organize:** `POST /matches` → 403
  `شما در حال حاضر واجد شرایط برگزاری مچ نیستید`. The app never hits this because its own guard
  routes an incomplete profile to `/profile-setup`, but any API client will.
- **`POST /otp/verify` returns `profileCompletionStatus`** (`INCOMPLETE`/`COMPLETE`, in the spec
  and live). `app/(auth)/otp/page.tsx:87` ignores it and spends a `fetchQuery(["me"])` to learn
  the same thing — the round trip TODO.md's staleness item is about.
- **All 5 clubs now carry real `logoUrl`, `bannerUrl` and `contactPhone`** on
  `media.patchapp.ir`. `lib/api/types.ts:62-65` declares all three; nothing renders any of them.
- **`GET /matches` hides cancelled matches** — the list read 0 with a CANCELLED match of the
  viewer's own in the database. It takes only `page`/`size`; whether it is viewer-scoped or
  global is still unknown (the probe account has no other matches).

## Bug: a cancelled match is still a joinable-looking invite

`DELETE /matches/{id}` soft-cancels, and **`GET /matches/invite/{token}` keeps answering 200**
for it, `status: CANCELLED`, token intact. `app/join/[token]/page.tsx` only shows
«این لینک معتبر نیست» when that GET *errors*, so a link to a cancelled match renders the full
invitation and a «پیوستن به مَچ» button. Client-side fix, no backend change: treat
`status !== "OPEN"` as the same dead end the 404 takes.

---

# Spec diff + probe — 2026-09-24

Spec re-fetched: **39 paths / 42 operations**, up from 37 / 39 on 2026-09-22. Every schema the app
already declares is unchanged except the two fields below. Probed with the same throwaway account
(`scripts/api.sh`, session from 2026-09-22 still valid); nothing was written — every probe was
an error path on an already-cancelled match.

## New: match results — `GET|POST /matches/{id}/result`, `POST /matches/{id}/result/vote`

- `POST …/result` (201) — `SubmitMatchResultRequest { teamAParticipantIds*, teamBParticipantIds*,
  sets*: [{teamAScore*, teamBScore*}] }`. **Ids are `accountId`s** (the participant's, not the
  player-profile id — for this account those differ: player `89b1c3c8…`, account `0e824d38…`).
- `GET …/result` (200) and `POST …/result/vote` (200) both return `MatchResultResponse`:
  `id, matchId, round, status, teamA/teamBParticipantIds, sets[], totalConfirmedParticipants,
  rejectCount, myVote, createdAt, updatedAt`. **`status` and `myVote` are undeclared strings**
  — enum values unknown until a real result exists.
- Vote body: `{ choice: "ACCEPT" | "REJECT" }` (declared enum).
- The shape reads as: one side submits, the confirmed participants vote, enough rejects sends it
  back (`round` increments?). **Unverified** — the happy path needs a match that was actually
  played: 4 confirmed players (both 2026-09-22 matches with 2/4 were `AUTO_CANCELLED`), which
  needs more accounts than we have.

What the error paths establish:

| Probe | Answer |
|---|---|
| GET result, match with none | 404 `matchmaking.result.notFound` (raw i18n key) |
| GET result, unknown match | 404 `مچ یافت نشد` |
| POST on a cancelled match (valid ids) | 409 `matchmaking.result.matchCancelled` |
| POST `{}` | 400, names all three empty fields |
| POST with a negative score | 400 `sets[0].teamAScore must be ≥ 0` |
| POST with a non-UUID id | 400 `validation.invalidFormat` (no field named) |
| vote with no result | 409 `matchmaking.result.votingNotOpen` |
| vote `"MAYBE"` | 400 `validation.invalidFormat` |

### Mismatch with the app's results page
`app/matches/[id]/results` models **many games per match** (+ افزودن بازی), each with its own
2v2 teams and sets. The API takes **one** result per match: one team A, one team B, a list of
sets. Americano/Mexicano rotate partners, which one result can't express. And there is **no voting
UI** at all — accept/reject, `myVote`, `rejectCount`. Its «ثبت نهایی نتایج» CTA still has no
`onClick`. Decide the model before wiring.

## New fields on existing schemas

- **`ActivityItemResponse.active: boolean`.** Live: `false` on all four of this account's rows
  (2 `CANCELLED`, 2 `AUTO_CANCELLED`). The feed **does** return cancelled matches (unlike
  `GET /matches`), and the app already maps them to "not-held" cards. `active` would let /activity
  split current from past without re-deriving it from status + time. Not read by the app yet.
- **`InviteDirectResponse.invitation: MatchInvitationResponse`.** The created invitation now
  comes back with each successful invite. `lib/api/types.ts:208` doesn't declare it; nothing
  needs it today (the wizard only reads failures).

## Unchanged
The other 39 operations, and every other schema the app declares (`MatchResponse`,
`MatchParticipantResponse`, `ClubResponse`, `PlayerResponse`, `CreateMatchRequest`, enums).

**Wired 2026-09-24:** `POST …/result` from `app/matches/[id]/results` (one game, user decision).
Still unwired: `GET …/result` (the match page doesn't know a result exists and keeps offering
«نهایی کردن نتیجه») and `POST …/result/vote` (no voting UI). Both wait on seeing a real result's
`status`/`myVote` values.

**Probed 2026-09-24 (later), match `512d9b25` (AMERICANO, 4 confirmed, starts 15:00 Tehran):**
- Submitting is **organizer-only**: a participant gets 403 `شما برگزارکننده‌ی این مچ نیستید`
  (Persian, passes through `resultFailureText` as-is). The app only shows the CTA to the creator,
  so this matches.
- Whether a result can be submitted **before the match ends** is still unknown — the organizer
  check answered first. Next: submit as the organizer (سپهر) and read the answer.

**2026-09-24 (afternoon) — the backend's data was reset.** Match `512d9b25` 404s and
`09379137806` signs up fresh (new account `27e4acde…`, profile INCOMPLETE). Clubs survived. The
results test has to be set up again.

**`GET /matches` excludes PRIVATE matches, even for their organizer.** Probed with a fresh private
match and a public control from the same account: `/matches` returned only the public one;
`/activity` returned both (`ORGANIZER`, `active: true`). The app now adds the viewer's own
non-cancelled private matches from `/activity` to the list (`getMatchList`). Worth raising with
the backend: should `/matches` include the viewer's own private matches? If it starts to, the merge
dedupes by id and needs no change. The app's /activity mapping was run against the live rows and
does show the private match — no app-side bug there.

**Timings, 2026-09-24** (authed, from the dev laptop): `/matches` 0.28s, `/players/me` 0.34s,
`/clubs` **0.85s** (five rows), `/activity` **1.2s**. The Next dev proxy adds ~0.05s. The app now
fetches clubs once per session and no longer blocks the list on `/activity`; the two slow
endpoints are worth raising with the backend.
