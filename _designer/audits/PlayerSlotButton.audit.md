# PlayerSlotButton — Audit

## v1 — 2026-07-11 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Empty-slot buttons all read "+ افزودن بازیکن" — up to 4 identical accessible names per game card and more across cards (rule 4.7, contextual labels for repeated actions). GameCard knows team/slot; pass an aria-label like `افزودن بازیکن به تیم ۱ بازی ۲` | Open |
| 2 | Token gap | `leading-[11px]` on name/level lines | Accepted — PlayerChip precedent (Figma dimension, match-details-misc audit) |
| 3 | Note | Fixed `h-14` slot height (Figma-free design decision) keeps empty/filled states aligned; consistent one-off, cf. StatusThumb `w-[91px]` | Accepted |

Notes: native `<button>`s ✓; filled state has contextual `aria-label` (`تغییر بازیکن: {name}`) ✓;
avatar `alt=""` decorative ✓; name truncates in narrow columns ✓; token-clean otherwise.

## v2 — 2026-07-11 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Repeated identical accessible names | Fixed v2 — new required `slotLabel` prop; empty → `افزودن بازیکن به {slotLabel}`, filled → `تغییر بازیکن {name} در {slotLabel}` |

**Breaking change:** `slotLabel: string` is now required. Only consumer (GameCard) updated —
passes `تیم N، بازی M`.

Regression check against v1: native button, alt="", truncation, tokens still clean.

### Status
Open: 0 | Fixed: 1 | Accepted: 2
