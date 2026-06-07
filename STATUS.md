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
- [x] Vazirmatn font — `app/layout.tsx` + `app/globals.css`

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

## Notes
- Background images are Figma CDN URLs (expire in 7 days). Move to `public/images/` before production.
- Profile stat/nav icons are Figma CDN URLs (expire in 7 days). Move to `public/icons/` before production.
- Post-onboarding destination: `/` (main app discover page).
