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

### 0d. Participant status enum — values learned by observation, still undeclared
`MatchParticipantResponse.status` and `joinChannel` are both `"type": "string"` with no enum.
Resolved by experiment on 2026-09-14 with a second account joining a `MANUAL_APPROVE` match:

| situation | `status` | `joinChannel` |
|---|---|---|
| organizer, `organizerJoins` default | `CONFIRMED` | `OPEN` |
| someone who asked to join, awaiting approval | **`REQUESTED`** | **`REQUEST`** |

Join requests are wired on that basis: `filled` counts `CONFIRMED`, `requests` are the
`REQUESTED` rows, and approve/reject post to
`/matches/{id}/participants/{participantId}/approve|reject`.

**Still an ask:** declare both enums in the spec. We are relying on two strings nobody has
written down, and we have not seen what a rejected or cancelled participant looks like — the
mapping treats anything that is neither value as belonging to neither list, which is safe but
untested. Same request as the match-level `status`.

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
