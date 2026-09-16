## v1 — 2026-06-08 | audit + refactor

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `rounded-[32px]` is arbitrary but a `rounded-card` token (32px) exists. | Fixed v1 — `rounded-[32px]` → `rounded-card`. |
| 2 | Suggestion | Roster maps with index keys; player objects have no id. | Accepted — static, non-reordered list. |
| 3 | Suggestion | Card title is `<h3>` under the page `<h1>` (skips `<h2>`); match list isn't a `<ul>`. | Open — minor heading/semantics polish. |
| 4 | Token gap | `text-[#00254D]`, divider `bg-[#E5EAF0]`, `shadow-[…]` — no tokens. | → TODO.md (systemic gray gap). |

Sub-parts audited separately: [[StatusBadge]], [[PlayerSlot]], [[MetaItem]], [[PriceTag]].

Regression check: n/a (v1)

## v2 — 2026-09-16 | layout pass (user mockup)
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 4 | Note | A compact version replaced the roster grid with an organizer avatar + byline; the user brought the player cards back the same day. Kept from that pass: club in the meta row, `rounded-group`, chevron CTA, tighter gaps | Accepted — roster stays on the card |
| 5 | Note | The meta row stays centred over the CTA (user). A right-aligned try hit the flex trap: `justify-end` under `dir="rtl"` left-aligned it | Clean |
| 6 | Note | `club` added to `MatchListItem` from `getClubs()`, dropped rather than fatal if that call fails | Clean |

### Status
Open: 1 | Fixed: 1 | Accepted: 2
