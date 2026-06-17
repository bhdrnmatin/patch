# Activity misc (StatusThumb, SectionDivider) — Audit

Small presentational components of the Activity page.
Grouped per the `match-details-misc` / `tournaments-misc` precedent.

## v1 — 2026-06-17 | audit

### StatusThumb — `activity/_components/StatusThumb.tsx`
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Token gap | `w-[91px]` (Figma thumbnail width), `text-[10px]` overlay label. | Accepted — Figma dimension / DateCell precedent |
| 2 | Suggestion | `<img alt="">` decorative — acceptable (court photo, title conveys context); `<img>` not next/image. | Systemic — Confirmed ✓ |

`h-28` (112px) and `rounded-lg` (8px) map exactly to Figma. `bg-edge` placeholder, `bg-black/70` overlay ✓.

### SectionDivider — `activity/_components/SectionDivider.tsx`
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | Labels (`زمین‌ها`, `مسابقه`, `سازنده بازی`) are section titles — could be `<h2>` for screen-reader navigation. | Open (systemic heading theme) |

Clean tokens: `h-6`, `gap-3`, `bg-edge` hairline, `text-sm font-bold text-ink-soft`. Optional `right`/`left`
labels with a flex-fill line; LTR flex keeps label placement correct.

### Status
Open: 1 | Fixed: 0 | Accepted: 2
