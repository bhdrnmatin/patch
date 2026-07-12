# Create-wizard chrome — Audit
`WizardHeader` · `StepChips` · `WizardFooter` (`app/matches/create/_components/`)

## v1 — 2026-07-12 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | StepChips are `h-9` (36px) — below the project's ≥44px touch-target rule (CLAUDE.md). Bump to `h-11`; the strip has room | Open |
| 2 | Warning | WizardFooter's pending state swaps the label to "در حال ثبت..." but doesn't set `aria-busy="true"` on the button (rule 4.5, loading buttons) | Open |
| 3 | Suggestion | StepChips: the current chip is `disabled`, so keyboard users can never focus the `aria-current="step"` element. Leave it enabled as a no-op or use `aria-disabled` | Open |
| 4 | Note | WizardHeader: `h1` + contextual close label + reused StageDial; text column is `items-end` on an LTR wrapper — RTL trap avoided correctly | Clean |
| 5 | Note | WizardFooter reuses the MatchCtaBar shell recipe (`rounded-t-group`, 430px centered, `disabled:opacity-40`); primary-left/back-right matches the wireframe review frame | Clean |

## v2 — 2026-07-12 | refactor
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | 36px chips | Fixed v2 — `h-11 px-4` (44px) |
| 2 | Warning | Missing `aria-busy` | Fixed v2 — `aria-busy={pending}` on the primary button |
| 3 | Suggestion | Current chip unfocusable | Fixed v2 — `disabled={i > current}` (current chip enabled, no-op click), jump guard `i < current` |

Regression check against v1: header/footer recipes, RTL, gating unchanged; chips screenshot-verified.

### Status
Open: 0 | Fixed: 3 | Accepted: 0
