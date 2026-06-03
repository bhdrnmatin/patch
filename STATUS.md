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

## Notes
- Background images are Figma CDN URLs (expire in 7 days). Move to `public/images/` before production.
- Post-onboarding destination: `/` (main app discover page).
