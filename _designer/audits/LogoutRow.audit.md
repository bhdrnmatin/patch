# LogoutRow — Audit

Settings row that logs out (`POST /auth/logout`). `app/profile/settings/_components/LogoutRow.tsx`.

## v1 — 2026-07-22 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | No `aria-busy` while the logout request is pending (button disables + label changes to "در حال خروج..."). | Open |

Clean otherwise: native `<button>`, logout icon `aria-hidden` + `currentColor` on `text-danger`, disabled during pending, redirect handled in `useAuth().logout`.

### Status
Open: 1 (Suggestion) | Fixed: 0 | Accepted: 0
