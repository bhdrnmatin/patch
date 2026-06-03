## v1 — 2026-06-03 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Critical | `showLabel` renders `<span>` not `<label>` — not linked to input via `htmlFor` | Fixed v2 |
| 2 | Critical | No `name` prop — can't be used in HTML forms | Fixed v2 |
| 3 | Warning | `focus:outline-none` removes keyboard focus ring — border color change acts as indicator | Accepted — `focus:border-[#33A3FF]` provides visible indicator |
| 4 | Warning | `toPersianDigits` runs on ALL inputs regardless of `numeric` flag | Fixed v2 |
| 5 | Warning | No `disabled` support | Fixed v2 |
| 6 | Warning | No `forwardRef` | Fixed v2 |
| 7 | Warning | Hardcoded hex values — no token system | Accepted — no token system in project |

## v2 — 2026-06-03 | refactor
`showLabel` now uses `<label htmlFor={id}>` linked via `useId()`. Added `name` prop. `toPersianDigits` only runs when `numeric=true`. Added `disabled` + `forwardRef`.

### Status
Open: 0 | Fixed: 5 | Accepted: 2
