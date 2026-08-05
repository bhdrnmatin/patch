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
| 2 | Suggestion | Calendar has no grid semantics / arrow-key navigation — 31 Tab stops, no Arrow/Home/End between days. Consistent with project precedent (`role="grid"` was deliberately removed from AvailabilityHeatmap). Accept, or add roving arrow-key nav if the calendar warrants it. | Open |
| 3 | Suggestion | Day buttons announce only the bare number ("۱۴"). Add `aria-label={\`${jd} ${monthName} ${jy}\`}` and mark today with `aria-current="date"` so screen readers get the full date. | Open |
| 4 | Suggestion | Past days are disabled via the native `disabled` attr (good) but styled with a JS ternary (`d.past ? "text-edge cursor-default" : …`) instead of the `disabled:` modifier. Works; not the canonical form. | Open |
| 5 | Suggestion | `today` (`new Date()`) + the 31-day `days` array (with jalali conversions) rebuild on every render. Negligible for a 31-item list, but `useMemo` on `[view]` would tidy it; seeding `today` once also avoids a theoretical SSR/hydration date mismatch across timezones/midnight. | Open |

### Status
Open: 0 Critical, 0 Warning, 4 Suggestion | Fixed: 0 | Accepted: 1
(Finding #1 withdrawn — global `:focus-visible` outline already handles focus rings app-wide.)
