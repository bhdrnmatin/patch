# MatchStageCard — Audit

## v1 — 2026-06-10 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Note | Figma `#7B93AF` (next-step label) and `#57728E` (value) both mapped to `muted`/`ink-soft` | See gray-ramp decision in TODO.md |

### Status
Open: 0 | Fixed: 0 | Accepted: 1

## v2 — 2026-09-24 | audit (cancelled frame, shipped 2026-09-22)
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 2 | Suggestion | **The cancelled pill is 8px shorter than the others.** The comment says it "takes the dial's height", but `min-h-16` (64px) is the dial alone. With the dial plus `p-1` the pill is 72px. Use `min-h-18` (or `min-h-[72px]`) if the two should match. | Open |
| 3 | Suggestion | **Cancelled looks like any other status**: same white pill, same `text-ink-soft` title. The only cue is the missing dial. Consider a danger/muted accent (e.g. a `bg-danger` dot, like the «جاری» badge's lime dot). | Open — design decision |
| 4 | Suggestion | `stage` is still required, so the page passes a meaningless `stage: 0` for cancelled. Make it optional alongside `totalStages`. | Open |

Clean: the page correctly drops share (pill + card), CTA and remove ✕ for a cancelled match.
Regression check against v1: #1 still accepted.

### Status
Open: 3 | Fixed: 0 | Accepted: 1

## v3 — 2026-09-24 | fix
#2 Fixed v3 — `min-h-18` (72px): the dialled pill's real height, so cancelled no longer sits 8px short.
#4 Fixed v3 — `stage` is optional; the page's cancelled entry passes `undefined`, not a fake `0`.
#3 still open — design decision (a cancelled accent).

### Status
Open: 1 | Fixed: 2 | Accepted: 1
