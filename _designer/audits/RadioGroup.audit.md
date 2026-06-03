## v1 — 2026-06-03 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Critical | No `role="radiogroup"` on container — screen readers don't know options are related | Fixed v2 |
| 2 | Warning | No `aria-label` or `aria-labelledby` on the group | Fixed v2 — added optional `label` prop |
| 3 | Warning | `rounded-[24px]`, `bg-black/[0.32]`, `border-[#57728E]` — hardcoded values | Accepted — no token system in project |

## v2 — 2026-06-03 | refactor
Added `role="radiogroup"` + optional `label` prop wired to `aria-label`.

### Status
Open: 0 | Fixed: 2 | Accepted: 1
