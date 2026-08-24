# API findings — live probe, 2026-08-24

Probed `https://api.patchapp.ir` (spec: `GET /v3/api-docs`, unauthenticated) with a real
player token via `scripts/api.sh`. 34 endpoints; ~20 exercised.

**Re-checked at the end of the session:** the API was redeployed mid-session — `MatchResponse`
gained `participants[]` and `MatchParticipantResponse` gained `photoUrl` (see #3). No endpoints
were added or removed, and **#1 is unchanged: `username` is still required and still 400s.** Photo upload, admin
endpoints, and approve/reject were not exercised — see "Not covered" at the end.

## Blockers

### 1. Profile save is broken — signup cannot complete
`PUT /players/me/profile` requires `username` (`400 "must not be blank"`), but the app
stopped sending it. `lib/api/types.ts:31` dropped it from `UpdateProfileRequest`, noting
*"backend still returns it; no longer shown/sent — removal pending"* — the backend removal
never happened.

Both call sites 400 today:
- `app/(auth)/profile-setup/page.tsx:95` — **a new user cannot finish signup**
- `app/profile/edit/personal/page.tsx:82`

When sent, the rule is `^[a-zA-Z0-9_]{3,20}$` — Latin only, 3–20 chars — in a Persian app
with no UI field to enter one.

**Decision needed:** backend makes `username` optional (and derives one), or the app
auto-generates and sends one. Not a fix to pick unilaterally.

### 2. accountId ≠ playerId, and no player is fetchable but yourself
```
JWT sub (accountId)   ec48485c-28ce-4bb8-becc-15ccb83cfb4d
players/me id         c4498f72-f811-4aab-ae53-532e6c3e39a5
GET /players/{id}     404    GET /players?query=  404    GET /players  404
```
`MatchResponse.organizerAccountId` and `MatchParticipantResponse.accountId` are account
ids that resolve to nothing. Consequences:
- A match's organizer cannot be shown by name.
- Match participants cannot be shown by name — see #3.
- The create wizard's "add a Patch player" teammate flow has **no backing endpoint** —
  only phone invites can work.
- Adding `GET /matches/{id}/participants` would *not* fix rosters on its own.

**Ask:** endpoints should return **player summaries** (playerId, name, avatarUrl), not
account ids. Plus a player lookup/search endpoint.

### 3. Participants are readable, but nameless — PARTIALLY FIXED 2026-08-24
A redeploy during this session added `participants: MatchParticipantResponse[]` to
`MatchResponse`, and `photoUrl` to each participant. The roster, the `filled` count and
the pending join-requests list are now all derivable from `GET /matches/{id}`.

What's still missing is the **name**: a participant carries `accountId`, `status`,
`joinChannel` and `photoUrl` — no display name, and per finding #2 the `accountId`
resolves to nothing. So the players grid can render avatars and a count but cannot label
anyone. Adding `firstName`/`lastName` (or a nested player summary) to
`MatchParticipantResponse` closes this and most of #2 at the same time.

Unverified against live data — the matches table is still empty (#4).

### 4. Clubs and matches tables are empty
`GET /clubs` and `GET /matches` both return `totalElements: 0`. `clubId` is required and
validated on `POST /matches` (a bogus UUID 400s), and clubs can only be created via
`POST /api/v1/admin/clubs`. **Nothing can be built end-to-end until a club is seeded**,
which needs admin credentials.

## Bugs

### 500s on ordinary bad input
```
GET /matches/abc           → 500    non-UUID path param
GET /matches/invite/nope   → 500    invite tokens are user-pasted — a typo crashes
GET /clubs?cityId=abc      → 500    non-UUID query param
```
All three should be 400/404. The invite-token case is user-facing.

### Validation errors are inconsistent
| Endpoint | Behaviour |
|---|---|
| `PUT /players/me/display-info` | field-level + Persian: `مقدار سمت ترجیحی «BANANA» نامعتبر است` |
| `PUT /players/me/profile` | field-level but **raw English**: `must match "^[a-zA-Z0-9_]{3,20}$"` — a regex, shown to a Persian user |
| `POST /matches` | **entirely null**: `{"details":[{"loc":null,"type":null}],"errorMessage":null}` |

On create, a missing field, a bad enum, and a nonexistent club are indistinguishable, so
the form cannot highlight anything. Jackson parse errors leak an untranslated i18n key
(`validation.invalidFormat`). 404s are correct throughout (`مچ یافت نشد`).

### Smaller
- `firstName` stores as `"متین "` — trailing whitespace is not trimmed.
- No profile-photo delete; upload is one-way.
- `preferredSide` is undocumented in the spec (bare `string`); actual values are
  `RIGHT`/`LEFT`, case-insensitive.

## Confirmed behaviour (previously unverified)
- Phone format is `09…`, not `+98…`.
- `gender` is `MALE`/`FEMALE`, accepts lowercase, normalizes to upper.
- `profileCompletionStatus` / `profileStatus`: `COMPLETE` / `INCOMPLETE`.
- `null` on `display-info` clears a field.
- Access-token TTL is 15 min. Refresh tokens **rotate and the old one dies immediately** —
  `lib/api/client.ts`'s single-flight refresh is the correct design; any concurrent
  refresh kills the session.
- JWT claims are only `iss/sub/exp/iat` — no role or name, so nothing about the user is
  readable client-side without `/players/me`.
- Location data is real: 31 provinces, 1449 cities. But there is no `GET /cities/{id}`,
  and `/players/me` returns only `residenceCityId`, so resolving one id to a name costs
  up to 31 requests. Already tracked as `ponytail:` debt at
  `app/profile/edit/personal/page.tsx:57` — the city picker starts blank even when set.

## Model mismatch
The create wizard has one axis (`americano | friendly | competitive`); the API has two:
`format` (`OPEN_MATCH|AMERICANO|MEXICANO`) × `matchType` (`FRIENDLY|COMPETITIVE`). The
mapping is undecided.

Also absent from the API entirely, though the view-models carry them: **fee/price** and
**skill level** (`avgLevel`, `restriction`).

## Not covered
`POST /players/me/profile-photo` (skipped — irreversible, no delete endpoint), all admin
endpoints (no credentials), club banner/logo upload, `invite/{token}/join`, and
participant approve/reject (need a real match, which needs a club).
