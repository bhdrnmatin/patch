## v1 — 2026-06-03 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Critical | Missing `type="button"` — inside a `<form>` this will trigger form submission | Fixed v2 |
| 2 | Critical | No `disabled` support — can't be disabled programmatically | Fixed v2 |
| 3 | Warning | No hover/active/focus-visible states — no visual feedback on interaction | Fixed v2 |
| 4 | Warning | No `forwardRef` — ref can't reach the native button element | Fixed v2 |
| 5 | Warning | `onClick` is required in props but `<button>` works without it | Fixed v2 |
| 6 | Warning | Hardcoded hex `#33A3FF`, arbitrary `rounded-[44px]`, `text-[14px]` — no token system | Accepted — no token system in project |

## v2 — 2026-06-03 | refactor
Added `type="button"` default, `disabled` prop with `disabled:opacity-50`, `hover:` states per variant, `forwardRef`, made `onClick` optional.

### Status
Open: 0 | Fixed: 5 | Accepted: 1
