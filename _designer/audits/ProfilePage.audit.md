## v1 — 2026-06-06 | refactor

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Critical | Hero image blurred — `blur-sm` (4px) applied to single image, making athlete blurry. Figma: background layer blur-[2px], athlete layer sharp. User-reported. | Fixed v1 — removed blur-sm and scale-110; image now sharp with blue overlay |
| 2 | Warning | `ProfileMeta` MetaItem missing `dir="ltr"` override — parent `dir="rtl"` cascades in, reversing value/label positions (value on right, label on left = wrong) | Fixed v1 — added dir="ltr" to MetaItem div |
| 3 | Warning | `ProfileMeta` label strings had mangled ` :` prefix (` :ساید ترجیحی`) instead of clean Persian label (`ساید ترجیحی:`) | Fixed v1 — corrected all label strings |
| 4 | Warning | `ProfileMeta` values used `font-bold` at `text-xs` — renders too heavy for small supporting labels. User reported unwanted bold. | Fixed v1 — changed to `font-medium` |
| 5 | Suggestion | `ProfileHero` edit icon uses a generic pencil SVG that doesn't match Figma's Vuesax Linear edit icon | Open — acceptable until icon system is established |

Regression check: n/a (v1)

### Status
Open: 1 | Fixed: 4 | Accepted: 0
