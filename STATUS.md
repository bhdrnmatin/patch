# Component Status

## Onboarding Flow

### Base Components
- [x] `Button` — `app/(auth)/_components/Button.tsx`
- [x] `ProgressBar` — `app/(auth)/onboarding/_components/ProgressBar.tsx`
- [x] `StoryCard` — `app/(auth)/onboarding/_components/StoryCard.tsx`

### Compound Components
- [x] `OnboardingActions` — `app/(auth)/onboarding/_components/OnboardingActions.tsx`

### Layout Components
- [x] `StorySlide` — `app/(auth)/onboarding/_components/StorySlide.tsx`

### Pages
- [x] `OnboardingPage` — `app/(auth)/onboarding/page.tsx`

### Infrastructure
- [x] Yekan Bakh font (local OTF, 400/700) — `app/fonts/` + `app/layout.tsx` + `app/globals.css`

---

## Sign-Up / Login Flow

### Base Components
- [x] `AuthInput` — `app/(auth)/_components/AuthInput.tsx`
- [x] `OtpBox` — `app/(auth)/_components/OtpBox.tsx`
- [x] `RadioOption` — `app/(auth)/_components/RadioOption.tsx`

### Compound Components
- [x] `OtpInput` — `app/(auth)/_components/OtpInput.tsx`
- [x] `RadioGroup` — `app/(auth)/_components/RadioGroup.tsx`
- [x] `AuthActions` — `app/(auth)/_components/AuthActions.tsx`

### Layout Components
- [x] `AuthCard` — `app/(auth)/_components/AuthCard.tsx`
- [x] `AuthSlide` — `app/(auth)/_components/AuthSlide.tsx`

### Pages
- [x] `LoginPage` — `app/(auth)/login/page.tsx`
- [x] `OtpPage` — `app/(auth)/otp/page.tsx`
- [x] `ProfileSetupPage` — `app/(auth)/profile-setup/page.tsx`
- [x] `AssessmentPage` — `app/(auth)/assessment/page.tsx`

---

---

## Design Token System

- [x] Tokens defined in `app/globals.css` `@theme` block (Tailwind v4)
- [x] All auth components refactored — no hardcoded hex or arbitrary design values
- [x] All onboarding components refactored
- [x] Token reference table in `CLAUDE.md`

---

---

## Profile Section

### Base Components
- [x] `PageHeader` — `app/profile/_components/PageHeader.tsx`
- [x] `StatCard` — `app/profile/_components/StatCard.tsx`
- [x] `NavRow` — `app/profile/_components/NavRow.tsx`

### Compound Components
- [x] `StatsGrid` — `app/profile/_components/StatsGrid.tsx`
- [x] `ProfileMeta` — `app/profile/_components/ProfileMeta.tsx`
- [x] `ProfileAvatar` — `app/profile/_components/ProfileAvatar.tsx`

### Layout Components
- [x] `ProfileHero` — `app/profile/_components/ProfileHero.tsx`
- [x] `SubPageLayout` — `app/profile/_components/SubPageLayout.tsx`

### Pages
- [x] `ProfilePage` — `app/profile/page.tsx`
- [x] `EditProfilePage` — `app/profile/edit/page.tsx`
- [x] `StatisticsPage` — `app/profile/statistics/page.tsx`
- [x] `SettingsPage` — `app/profile/settings/page.tsx`
- [x] `SupportPage` — `app/profile/support/page.tsx`
- [x] `RulesPage` — `app/profile/rules/page.tsx`

---

## Matches Flow

Figma: Match page + Sort sheet + Filter sheet → route `/matches` with two modal states.
All components live in `app/(main)/matches/_components/` unless noted.

### Base Components
- [x] `icons` — inline Matches icon set (filter-search, sort, calendar, chart, people, close, info)
- [x] `IconButton` — circular glassmorphic header button
- [x] `DateCell` — single day cell (selected / default / past states)
- [x] `StatusBadge` — match status pill (جاری / برگزار شده / برگزار نشده)
- [x] `PlayerSlot` — avatar + name + level
- [x] `MetaItem` — icon + label (avg level / players / date)
- [x] `PriceTag` — amount + تومان in Persian digits
- [x] `SelectChip` — selectable pill for sheets (selected / unselected)

### Compound Components
- [x] `DateSelector` — horizontal scroll row of `DateCell`
- [x] `MatchCard` — full match card (badge + title + player grid + meta + price)
- [x] `MatchesHeader` — hero header (bg + title + 2 `IconButton` + `DateSelector`)
- [x] `FilterSection` — labeled group of `SelectChip`
- [x] `BottomSheet` — modal shell (overlay + sheet + header + footer)

### Layout Components
- [x] `SortSheet` — `BottomSheet` + sort `FilterSection`s + footer
- [x] `FilterSheet` — `BottomSheet` + filter `FilterSection`s + footer

### Pages
- [x] `MatchesPage` — `app/(main)/matches/page.tsx`

### Data
- [x] `MatchListItem` / `MatchStatus` types — `lib/types.ts`
- [x] Mock matches + dates — `lib/mock/index.ts`

### Reused (not rebuilt)
- `BottomNav` (via `(main)/layout.tsx`), `Button` (auth pill, sheet footers), `toPersianDigits`.

---

## Patterns

| Pattern | Status | Spec | Implementation |
|---|---|---|---|
| AddMenu (plus-button speed dial) | ✅ Done | `patterns/AddMenu.spec.md` | `app/(main)/_components/BottomNav.tsx` |

---

## Notes
- All assets are local now — no Figma CDN URLs in code. Images in `public/images/`, icons in `public/icons/`.
- Background images optimized: WebP, resized to ≤1280px, q80 (~30MB PNG → 1.4MB total).
- Post-onboarding destination: `/` (main app discover page).
- All pages render as a centered `max-w-[430px]` column on a black backdrop (desktop-safe).

## Open items
See [TODO.md](TODO.md) — token gaps from the Matches audit and sort/filter behavior wiring.
Change history in [CHANGELOG.md](CHANGELOG.md).
