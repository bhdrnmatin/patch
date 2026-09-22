## v1 — 2026-06-08 | audit + refactor

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Footer buttons used arbitrary radii `rounded-[48px]` / `rounded-[32px]`. | Fixed v1 — `rounded-full` / `rounded-card`. |
| 2 | Suggestion | Footer secondary button is inline rather than reusing the auth `Button`. | Accepted — auth `Button` ghost unfit for a light glass sheet. |
| 3 | Note | Multi-select state is local cosmetic; not yet wired to filter the list. | Open — wire when real data lands. |

Composes [[BottomSheet]] + [[FilterSection]]; levels use `toPersianDigits`.

### Status
Open: 1 | Fixed: 1 | Accepted: 1

## v2 — 2026-09-22 | wired
#3 Closed v2 — وضعیت and لول wired 2026-07-12; **تاریخ** wired today via `dateFacetRange`
(`lib/jalali.ts`, tested): امروز/این هفته/این ماه as real Jalali ranges — the week ends on جمعه,
the month on its own last day (29/30/31), and a facet never reaches backwards. **مسافت removed**
(user). Left open elsewhere, not here: **نوع** still can't narrow — the card carries no
`matchType`, and رقابتی is refused by the API anyway. Tracked in TODO.md.

### Status
Open: 0 | Fixed: 2 | Accepted: 1
