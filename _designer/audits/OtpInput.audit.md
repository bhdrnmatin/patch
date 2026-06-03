## v1 — 2026-06-03 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Critical | No paste support — users commonly paste OTP codes from SMS | Fixed v2 |
| 2 | Warning | Hidden inputs are `opacity-0` but still tab-focusable — keyboard hits 5 invisible inputs | Accepted — inputs are invisible but functional; tab through them is correct behavior for OTP |
| 3 | Warning | `h-[49px]` — arbitrary height with no token | Accepted — matches Figma spec |
| 4 | Suggestion | Backspace on index 0 with empty value — minor UX edge case | Accepted — harmless |

## v2 — 2026-06-03 | refactor
Added `onPaste` handler on the container — strips non-digits, converts to Persian, populates all 5 boxes at once and focuses the correct next box.

### Status
Open: 0 | Fixed: 1 | Accepted: 3
