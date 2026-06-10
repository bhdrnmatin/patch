## v1 — 2026-06-08 | audit + refactor

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `rounded-[32px]` is arbitrary but a `rounded-card` token (32px) exists. | Fixed v1 — `rounded-[32px]` → `rounded-card`. |
| 2 | Suggestion | Roster maps with index keys; player objects have no id. | Accepted — static, non-reordered list. |
| 3 | Suggestion | Card title is `<h3>` under the page `<h1>` (skips `<h2>`); match list isn't a `<ul>`. | Open — minor heading/semantics polish. |
| 4 | Token gap | `text-[#00254D]`, divider `bg-[#E5EAF0]`, `shadow-[…]` — no tokens. | → TODO.md (systemic gray gap). |

Sub-parts audited separately: [[StatusBadge]], [[PlayerSlot]], [[MetaItem]], [[PriceTag]].

Regression check: n/a (v1)

### Status
Open: 1 | Fixed: 1 | Accepted: 1
