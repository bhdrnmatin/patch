# StepSchedule — Audit

Timing step (jalali calendar + time slots + duration) of the create-match wizard.
`app/matches/create/_components/StepSchedule.tsx` + data helper `lib/jalali.ts`.

## v1 — 2026-08-05 | audit

Feature step component (takes `draft`/`patch`, like its siblings), not a reusable
primitive — so Props-API rules (extend native attrs, forwardRef, cn, className
passthrough) don't apply; consistent with StepDetails/StepLocation. All controls are
native `<button>`s, tokens are used throughout (no hardcoded hex), icons use
`currentColor` + `aria-hidden`, `aria-pressed` is on every chip/slot/day, month-nav
buttons are labeled. `lib/jalali.ts` is pure + self-checked (`lib/jalali.test.ts`) —
no issues.

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | ~~Warning (Systemic)~~ | ~~No `focus-visible` ring on interactive controls.~~ **WITHDRAWN — false positive:** `app/globals.css:75` already applies a global `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px }` to every element, so all buttons here get a brand keyboard focus ring. Elements that set `focus:outline-none` (inputs/SelectField) replace it with `focus:border-primary`. Focus is visible app-wide. | Accepted |
| 2 | Suggestion | Calendar has no grid semantics / arrow-key navigation — 31 Tab stops, no Arrow/Home/End between days. Consistent with project precedent (`role="grid"` was deliberately removed from AvailabilityHeatmap). Accept, or add roving arrow-key nav if the calendar warrants it. | Accepted |
| 3 | Suggestion | Day buttons announce only the bare number ("۱۴"). Add `aria-label={\`${jd} ${monthName} ${jy}\`}` and mark today with `aria-current="date"` so screen readers get the full date. | Fixed |
| 4 | Suggestion | Past days are disabled via the native `disabled` attr (good) but styled with a JS ternary (`d.past ? "text-edge cursor-default" : …`) instead of the `disabled:` modifier. Works; not the canonical form. | Fixed |
| 5 | Suggestion | `today` (`new Date()`) + the 31-day `days` array (with jalali conversions) rebuild on every render. Negligible for a 31-item list, but `useMemo` on `[view]` would tidy it; seeding `today` once also avoids a theoretical SSR/hydration date mismatch across timezones/midnight. | Accepted |

## v2 — 2026-08-07 | refactor

- **#3 Fixed** — each day button now carries `aria-label="۱۴ مرداد ۱۴۰۵"` (Persian digits, month name
  from the viewed month) and `aria-current="date"` on today.
- **#4 Fixed** — past days style through `disabled:text-edge disabled:cursor-default`; the ternary is
  back down to selected / default.
- **#2 Accepted** — the project precedent stands (`role="grid"` was deliberately removed from
  AvailabilityHeatmap). Every day is a labeled, `aria-pressed` button reachable by Tab; roving arrow-key
  nav is a real feature, not a cleanup — revisit if the calendar grows multi-month.
- **#5 Accepted** — no measured cost (31 items, one render per month change). The SSR-mismatch part of
  the finding doesn't hold: a `useState` seed still evaluates separately on server and client, so it
  wouldn't prevent a timezone/midnight hydration difference — that needs a mount effect, which is a
  bigger change than the (nonexistent) problem warrants.

### Status
Open: 0 | Fixed: 2 | Accepted: 3
(Finding #1 withdrawn in v1 — global `:focus-visible` outline already handles focus rings app-wide.)
