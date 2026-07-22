# LogoutRow — Audit

Settings row that logs out (`POST /auth/logout`). `app/profile/settings/_components/LogoutRow.tsx`.

## v1 — 2026-07-22 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | No `aria-busy` while the logout request is pending (button disables + label changes to "در حال خروج..."). | Open |

Clean otherwise: native `<button>`, logout icon `aria-hidden` + `currentColor` on `text-danger`, disabled during pending, redirect handled in `useAuth().logout`.

## v2 — 2026-07-22 | fix
Added `aria-busy={pending}` on the logout button.

### Status
Open: 0 | Fixed: 1 | Accepted: 0
