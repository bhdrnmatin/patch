## v1 — 2026-06-08 | audit + refactor

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Footer buttons used arbitrary radii `rounded-[48px]` / `rounded-[32px]`. | Fixed v1 — `rounded-full` / `rounded-card`. |
| 2 | Suggestion | Footer secondary button is inline rather than reusing the auth `Button`. | Accepted — auth `Button` ghost unfit for a light glass sheet. |
| 3 | Note | Multi-select state is local cosmetic; not yet wired to filter the list. | Open — wire when real data lands. |

Composes [[BottomSheet]] + [[FilterSection]]; levels use `toPersianDigits`.

### Status
Open: 1 | Fixed: 1 | Accepted: 1
