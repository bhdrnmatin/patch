# NavRow — Audit

Profile nav row (`Link`), plus a `comingSoon` inactive variant. `app/profile/_components/NavRow.tsx`.

## v1 — 2026-07-22 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | `comingSoon` renders a `<div aria-disabled="true">` — meaning is carried by the visible "به زودی" text; `aria-disabled` on a non-role element isn't announced as a disabled control by all screen readers. Acceptable for a passive placeholder. | Open |
| 2 | Accepted | Custom props (label/href/icon), no native-attr extension | Accepted — project presentational pattern |

Clean otherwise: active rows are real `<Link>`s; `ArrowLeft` / icon `aria-hidden`; `comingSoon` correctly non-interactive (div, not a dead link).

### Status
Open: 1 (Suggestion) | Fixed: 0 | Accepted: 1
