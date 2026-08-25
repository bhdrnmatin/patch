# API findings — live probe, 2026-08-24

Probed `https://api.patchapp.ir` (spec: `GET /v3/api-docs`, unauthenticated) with a real
player token via `scripts/api.sh`. 34 endpoints, all but the admin ones exercised —
including a full create → invite → join → delete cycle against real clubs.

The API was **redeployed three times during the session**, so this is a moving target.
Findings below are as of the last pass; re-run before trusting any of it.

## Fixed so far

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
  is 405. An invited phone does **not** appear in `participants` until it accepts, so a
  creator cannot see who they have already invited — the roster shows only joined players.
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
A 90-minute booking — the standard padel slot — is **inexpressible**, and sending 1.5
silently records a 60-minute match rather than failing. The wizard currently offers only
۶۰/۱۲۰ minutes so it maps cleanly today, but any 90-minute option would lose data.

**Ask:** make it `durationMinutes`, or reject non-integers instead of truncating. Also
add an upper bound — a 99-hour match is accepted.

### 3. Create-match validation errors are empty
`{"details":[{"loc":null,"type":null}],"errorCode":null,"errorMessage":null}` — identical
for a missing field, a bad enum, and a nonexistent club. **This is what made #2 take a
bisection to find**, and it means the wizard can never highlight the offending field.

Other endpoints do this correctly, which makes the gap look like one missing handler:
| Endpoint | Behaviour |
|---|---|
| `POST /matches/{id}/invitations` | ✅ per-phone `success`/`failureMessage`, Persian |
| `PUT /players/me/display-info` | ✅ field-level Persian |
| `POST /matches/{id}/join` | ✅ `409 شما قبلاً در این مچ عضو شده‌اید` |
| `PUT /players/me/profile` | ⚠️ field-level but **raw English**: `must match "^[a-zA-Z0-9_]{3,20}$"` |
| `POST /matches` | ❌ entirely null |

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
