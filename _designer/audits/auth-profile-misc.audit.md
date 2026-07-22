# Auth/Profile misc — Audit

Small components from the API/auth work. 2026-07-22 | audit.

## AuthGuard — `app/_components/AuthGuard.tsx`
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | Renders `null` during the "checking" phase → a blank flash on protected routes before auth resolves. A minimal loader would improve perceived performance. | Open |

## ProfileAvatar — `app/profile/_components/ProfileAvatar.tsx`
Clean. `<img>` (accepted project deviation), `alt` present, `onError` falls back to the default silhouette and is guarded against a loop (`endsWith` check). `src` optional → default. No findings.

## ProfileAvatarLive — `app/profile/_components/ProfileAvatarLive.tsx`
Clean. Thin client wrapper reading `useAuth().player?.avatarUrl` with fallback. No findings.

## ProfileIdentity — `app/profile/_components/ProfileIdentity.tsx`
Clean. Reads live name/username/bio from `useAuth().player`; `@username` in `dir="ltr"`; RTL text handled. No findings.

## fix — 2026-07-22
AuthGuard: replaced the blank `null` with a centered spinner (`role="status"`) during the checking phase.

### Status
Open: 0 | AuthGuard fixed | others clean
