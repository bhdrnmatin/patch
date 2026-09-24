# PlayerChip — Audit

v1 was a clean pass inside `match-details-misc.audit.md` (2026-06-10). This file takes over from v2.

## v2 — 2026-09-24 | audit (organizer ✕, shipped 2026-09-22)
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | **Removing a player is one tap, with no confirm.** `ShareCard`'s own comment says the app only asks twice for things that are «irreversible for other people», and throwing someone out of a match is exactly that. The 44px hit area around a 20px glyph (`-top-2 -left-2 size-11`) makes a mis-tap *more* likely, not less. Fix: the same arm-then-confirm pattern `ShareCard` uses (with a timeout, see ShareCard #1), or a small confirm sheet via `BottomSheet`. | Open |
| 2 | Suggestion | The ✕ has no pressed feedback. Every other tappable surface on the page has `active:opacity-70/80`; this one only dims when disabled. Add `active:opacity-70`. | Open |
| 3 | Suggestion | `aria-label={\`حذف ${player.name} از مَچ\`}` — contextual per rule 4.7. ✓ | Clean |
| 4 | Systemic | No `cn()`/`forwardRef`/native-attr extension, `<img>` over `next/image`, no focus-visible ring | Confirmed ✓ (accepted in match-details-misc v1) |

### Status
Open: 2 | Fixed: 0 | Accepted: 1

## v3 — 2026-09-24 | fix
#1 Fixed v3 — the ✕ now only **arms**: a full-chip `bg-danger` confirm («حذف {name}؟ دوباره بزن») covers the chip, so the second tap is a big, separate target, and it disarms after 4s (a timer, not `onBlur` — iOS never blurs a tapped button). It stays up as «در حال حذف…» while the request runs.
#2 Fixed v3 — `active:opacity-70` on the ✕.
Note: white on `bg-danger` is ~3.3:1, under AA for 12px bold. It's part of the systemic `text-danger` contrast finding (ShareCard #7), which is waiting on a decision.

### Status
Open: 0 | Fixed: 2 | Accepted: 1
