# ScoreStepper — Audit

## v1 — 2026-07-11 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Score value changes are not announced to screen readers — the value `<span>` updates silently after ± activation. Fix: `aria-live="polite"` on the value span | Open |
| 2 | Suggestion | − button has no hover state while + has `hover:bg-primary-hover`; also − stays enabled at the 0 floor (no-op tap). Consider `hover:bg-edge` + `disabled={value <= 0}` | Open |
| 3 | Systemic | No `focus-visible` ring on buttons | Confirmed ✓ (project-wide open) |

Notes: token-clean (surface/edge/ink-soft/primary/primary-hover, default scale sizes);
44px touch targets (`size-11`); contextual aria-labels (`کم کردن امتیاز تیم ۱ در ست ۲`) ✓;
custom `onChange(value)` signature is idiomatic for a composite stepper (not a form input).

## v2 — 2026-07-11 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Silent value updates | Fixed v2 — `aria-live="polite"` on the value span |
| 2 | Suggestion | − hover parity / floor no-op | Partially fixed v2 — `hover:bg-edge` added; floor-disable REJECTED: disabling under the pointer drops keyboard/SR focus mid-interaction (worse than a no-op) |

Regression check against v1: token usage, touch targets, contextual labels still clean.

### Status
Open: 0 | Fixed: 1 | Accepted: 1 (+1 systemic confirmed)
