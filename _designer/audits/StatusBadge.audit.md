## v1 — 2026-06-08 | audit

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Good | Status-driven label + tone via lookup maps; `rounded-pill` + `bg-primary` tokens used. | — |
| 2 | Token gap | held `bg-[#E8F5E9]`/`text-[#2E7D32]`, not-held `bg-[#F5F7FA]`/`text-[#6783A0]` — no tokens. | → TODO.md. |

### Status
Open: 0 | Fixed: 0 | Accepted: 0

## v2 — 2026-06-16 | fix
Label map extracted to shared `lib/status.ts` (`statusLabels`) so PosterBadge (tournaments) can
reuse it. `TONES` stay local (StatusBadge is the only consumer of the colored-pill tones).
No findings; visuals unchanged.
