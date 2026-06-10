## v1 — 2026-06-08 | audit + refactor

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Chip group had no grouping semantics for screen readers. | Fixed v1 — `role="group"` + `aria-label={label}` on the wrapper. |
| 2 | Good | Delegates selection state to [[SelectChip]] via `aria-pressed`; supports single- and multi-select via `value: string \| string[]`. | — |

Regression check: n/a (v1)

### Status
Open: 0 | Fixed: 1 | Accepted: 0
