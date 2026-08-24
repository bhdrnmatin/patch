# API findings — live probe, 2026-08-24

Probed `https://api.patchapp.ir` (spec: `GET /v3/api-docs`, unauthenticated) with a real
player token via `scripts/api.sh`. 34 endpoints, all but the admin ones exercised —
including a full create → invite → join → delete cycle against real clubs.

The API was **redeployed three times during the session**, so this is a moving target.
Findings below are as of the last pass; re-run before trusting any of it.

## Fixed during the session

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

### 1. accountId ≠ playerId, and no player is fetchable but yourself
```
JWT sub (accountId)   ec48485c-28ce-4bb8-becc-15ccb83cfb4d
players/me id         c4498f72-f811-4aab-ae53-532e6c3e39a5
GET /players/{id}     404    GET /players?query=  404    GET /players  404
```
`organizerAccountId` and `MatchParticipantResponse.accountId` are account ids that
resolve to nothing, and a participant carries no name — only `accountId`, `status`,
`joinChannel`, `photoUrl`. So the players grid can render avatars and a count but
**cannot label a single person**, and the organizer can't be named.

It also means the create wizard's "add a Patch player" teammate flow has **no backing
endpoint** — only phone invites can work.

**Ask:** put `firstName`/`lastName` (or a nested player summary) on
`MatchParticipantResponse`, and add a player lookup/search endpoint.

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

**These three *should* be required** (decision 2026-08-24) — a match with no duration,
capacity or title is meaningless. The bug is that they aren't *declared* required, so
the spec is wrong and enforcement happens deep enough that a missing `title` surfaces
as a 500. Annotating them fixes the spec and the error shape at once.

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

### 500s on ordinary bad input
```
GET /matches/abc           → 500    non-UUID path param
GET /matches/invite/nope   → 500    invite tokens are user-pasted — a typo crashes
GET /clubs?cityId=abc      → 500    non-UUID query param
POST /matches (no title)   → 500    see #2
```
All should be 400/404. The invite-token case is user-facing: a mistyped invite link
crashes instead of showing "link not found."

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
- `DELETE /matches/{id}` works and is how this probe's test data was cleaned up.
- Location data is real: 31 provinces, 1449 cities. But there is no `GET /cities/{id}`,
  and `/players/me` returns only `residenceCityId`, so resolving one id to a name costs
  up to 31 requests. Tracked as `ponytail:` debt at
  `app/profile/edit/personal/page.tsx:57` — the city picker starts blank even when set.

## Model mismatches with the app
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
