# Create-form primitives — Audit
`TextField` · `TextArea` · `SelectField` · `OptionSheet` · `ToggleSetting` (`app/matches/create/_components/`)

The app's first light-theme form controls (AuthInput is dark-glass only). API mirrors AuthInput
(`label, value, onChange(value)`) — project convention, accepted.

## v1 — 2026-07-12 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | SelectField opens a modal BottomSheet but doesn't announce it — add `aria-haspopup="dialog"` (and ideally `aria-expanded`) to the trigger | Open |
| 2 | Note | TextField/TextArea wrap control in `<label>` ✓; SelectField uses `aria-labelledby` (label id + value id) so SR hears label AND current value ✓ | Clean |
| 3 | Note | OptionSheet mirrors the audited PlayerPickerSheet — `aria-pressed` rows, stable `key={option.id}`, BottomSheet dialog a11y inherited | Clean |
| 4 | Note | ToggleSetting reuses FilterSection (`role="group"` + `aria-label`) with SelectChip `aria-pressed` بله/خیر pair | Clean |
| 5 | Systemic | No `focus-visible` ring (inputs use `focus:border-primary` like AuthInput — acceptable for text fields; buttons covered by the project-wide open item) | Confirmed ✓ |

Notes: token-clean throughout (rounded-card/rounded-group, edge/muted/ink-soft/primary,
shadow-card); `numeric` → `toPersianDigits` per CLAUDE.md; no layout opinions beyond `w-full`
(project card convention).

## v2 — 2026-07-12 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | SelectField popup not announced | Fixed v2 — `aria-haspopup="dialog"` on the trigger |

Regression check against v1: labelledby wiring, tokens, OptionSheet/ToggleSetting untouched.

### Status
Open: 0 | Fixed: 1 | Accepted: 0
