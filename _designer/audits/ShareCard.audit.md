# ShareCard — Audit

v1 was a clean pass inside `match-details-misc.audit.md` (2026-06-10). This file takes over from v2.

## v2 — 2026-09-24 | audit (two-tap revoke + copy fallback, shipped 2026-09-22)
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | **The armed state never expires on iPhone.** Disarming relies on `onBlur`, but iOS Safari doesn't focus a `<button>` on tap, so it never blurs. «مطمئنی؟ برای تایید دوباره بزن» stays up for as long as the page is open, and the next tap, whenever it comes, kills the link. Fix: disarm on a timeout too, the same way `renewed` clears after 4s. | Open |
| 2 | Warning | **Status changes are not announced.** «لینک کپی شد» and «لینک تازه ساخته شد» swap text inside a button, and the «کپی نشد» fallback line appears silently. Only `revokeFailed` has `role="alert"`. Fix: `aria-live="polite"` on the label span and on the fallback `<p>`. | Open |
| 3 | Warning | **The red text fails contrast.** `text-danger` (#FF4869) is about 3.1:1 on `bg-surface` and 3.3:1 on white, at 12px/10px (the armed label and the failure line). `text-muted` (#6783A0) is about 3.65:1 on `bg-surface` (the idle «ساخت لینک تازه», the warning line, the fallback line). AA asks for 4.5:1 at these sizes. | Open — systemic, see below |
| 4 | Suggestion | There's a short window where the old link can still be shared. A tap on the share button after a revoke but before the refetch lands shares the dead token. The regenerate response already carries the new `inviteToken`, so `setQueryData` would close the window, if the mapped `matchDetails` shape allows it. | Open |
| 5 | Suggestion | `disabled:opacity-60` here, `disabled:opacity-40` on the PlayerChip ✕ and elsewhere. Pick one. | Open |
| 6 | Suggestion | `setTimeout`s (`copied`, `renewed`) aren't cleared on unmount. Harmless in React 18, just untidy. | Open |
| 7 | Systemic | **`text-muted` / `text-danger` as small text on light surfaces are under AA 4.5:1 app-wide**, not just here. | Promoted 2026-09-24 — anti-patterns.md #19; token fix → TODO.md |
| 8 | Systemic | Template-literal className instead of `cn()`, no focus ring | Confirmed ✓ (accepted in match-details-misc v1) |

The copy-failed fallback itself is sound: `select-all` + `break-all` on an LTR span, shown only on `"failed"`. ✓

### Status
Open: 6 | Fixed: 0 | Accepted: 1 | Systemic: 1 promoted

## v3 — 2026-09-24 | fix
#1 Fixed v3 — `armed` disarms after 4s via an effect (cleared on re-arm/unmount); `onBlur` kept for desktop.
#2 Fixed v3 — `aria-live="polite"` on the share label and the revoke button, `role="status"` on the copy-failed line.

### Status
Open: 4 | Fixed: 2 | Accepted: 1 | Systemic: 1 promoted

## v4 — 2026-09-24 | fix
#5 Fixed v4 — `disabled:opacity-40`, same as everywhere else.
#6 Fixed v4 — `copied` and `renewed` clear through effects like `armed`, so unmounting cancels them.
#3 → TODO.md contrast item; #4 (stale-token window) still open.

### Status
Open: 1 | Fixed: 4 | Accepted: 1 | Systemic: 1 promoted
