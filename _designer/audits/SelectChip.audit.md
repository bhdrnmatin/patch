## v1 — 2026-06-08 | audit + refactor

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `rounded-[48px]` arbitrary on a 48px-tall pill. | Fixed v1 — `rounded-full` (visually identical, no arbitrary value). |
| 2 | Good | Native `<button>`, `aria-pressed`, keyboard-operable. | — |
| 3 | Token gap | `shadow-[0px_2px_8px_rgba(37,51,67,0.06)]` — no token. | → TODO.md. |

Regression check: n/a (v1)

### Status
Open: 0 | Fixed: 1 | Accepted: 0
