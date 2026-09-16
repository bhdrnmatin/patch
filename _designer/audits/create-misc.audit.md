# Create wizard — misc audit
Step components + page: `StepDetails` · `StepLocation` · `StepSchedule` · `StepPlayers` ·
`StepSettings` · `StepReview` · `TeamPreview` · `ReviewPlayers` · `page.tsx`
(`app/matches/create/`)

## v1 — 2026-07-12 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Note | StepLocation's "انتخاب روی نقشه" is a dead button | Accepted — user-approved cosmetic until a maps SDK exists (logged in TODO.md) |
| 2 | Note | StepSchedule wraps DateSelector in `-mx-6` to counteract its baked-in `px-6` — works; if a third consumer needs this, lift the padding out of DateSelector instead | Accepted |
| 3 | Note | Wizard state is a single `CreateMatchDraft` object + per-step `isStepValid` gating; steps are state-only (no history entries) so BottomSheet's history-based back-close stays sound | Clean |
| 4 | Note | Teammate identity = indexes into `pickablePlayers` (no id on `MatchPlayer`) — same mock-era limitation as the results feature; switch to real ids with the API (TODO.md) | Accepted for mock era |
| 5 | Note | ReviewPlayers: `ul/li`, role tags, `h2` under the page `h1`, optional level handled; TeamPreview is display-only with dashed empty slots | Clean |
| 6 | Note | StepReview reuses audited DescriptionCard/ScheduleCard/CourtCard/InfoBanner; CourtCard's cosmetic مسیریابی/edit buttons appear read-only in review | Accepted — mock era |

Notes: court-grid buttons and picker rows use `aria-pressed`; search input has `aria-label`;
empty court-search state handled ("زمینی پیدا نشد"); map `img` has meaningful alt; submit runs
`createMatch` via useMutation with `isPending` on the CTA and `["matches"]` invalidation.

## v2 — 2026-09-16 | fix
Wiring `createMatch` to the API turned two quiet gaps into live bugs.

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 7 | Critical | A failed create showed nothing — `useMutation` had no error path, so a 400 or a dropped connection just stopped the spinner on step ۵ | Fixed — `ApiError.message` (the server's Persian) as `role="alert"` above the footer; cleared on any step change |
| 8 | Warning | Every time slot was tappable on today, and the server rejects a past start in English (`must be a future date`) | Fixed — `isSchedulable` disables closed slots and gates step ۳, so a resumed stale draft can't pass either |
| 9 | Note | `InviteFailures` (new): report card for invites the server refused after create. RTL per the flex rule, tokens only, reuses `ResumeDraftBar`'s card idiom | Clean |
| 4 | Note | Teammate identity = indexes into `pickablePlayers` | Still accepted — phone invites are real now; Patch players wait on invite-by-account-id |

### Status
Open: 0 | Fixed: 2 | Accepted: 4
