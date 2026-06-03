## v1 — 2026-06-03 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `flex-1 h-full` depends on a sized parent — component has implicit layout contract | Accepted — intentional, always used inside OtpInput |
| 2 | Warning | `border-[1.5px]` / `border-[1.008px]` — non-standard border widths | Accepted — matches Figma spec |
| 3 | Warning | `text-[21.5px]` — arbitrary font size with no token | Accepted — matches Figma spec |
| 4 | Warning | No `aria-hidden` — display-only visual, interaction handled by hidden inputs in OtpInput | Fixed v2 |

## v2 — 2026-06-03 | refactor
Added `aria-hidden="true"` — OtpInput's hidden inputs handle all interaction and screen reader state.

### Status
Open: 0 | Fixed: 1 | Accepted: 3
