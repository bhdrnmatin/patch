# Onboarding Flow — Component Status

## Base Components
- [x] `OnboardingButton` — `app/(auth)/onboarding/_components/OnboardingButton.tsx`
- [x] `ProgressBar` — `app/(auth)/onboarding/_components/ProgressBar.tsx`
- [x] `StoryCard` — `app/(auth)/onboarding/_components/StoryCard.tsx`

## Compound Components
- [x] `OnboardingActions` — `app/(auth)/onboarding/_components/OnboardingActions.tsx`

## Layout Components
- [x] `StorySlide` — `app/(auth)/onboarding/_components/StorySlide.tsx`

## Pages
- [x] `OnboardingPage` — `app/(auth)/onboarding/page.tsx`

## Infrastructure
- [x] Vazirmatn font — added to `app/layout.tsx` + `app/globals.css`

---

## Sign-Up / Login Flow

### Base Components
- [ ] `AuthInput` — `app/(auth)/_components/AuthInput.tsx`
- [ ] `OtpBox` — `app/(auth)/_components/OtpBox.tsx`
- [ ] `RadioOption` — `app/(auth)/_components/RadioOption.tsx`

### Compound Components
- [ ] `OtpInput` — `app/(auth)/_components/OtpInput.tsx`
- [ ] `RadioGroup` — `app/(auth)/_components/RadioGroup.tsx`
- [ ] `AuthActions` — `app/(auth)/_components/AuthActions.tsx`

### Layout Components
- [ ] `AuthCard` — `app/(auth)/_components/AuthCard.tsx`
- [ ] `AuthSlide` — `app/(auth)/_components/AuthSlide.tsx`

### Pages
- [ ] `LoginPage` — `app/(auth)/login/page.tsx`
- [ ] `OtpPage` — `app/(auth)/otp/page.tsx`
- [ ] `ProfileSetupPage` — `app/(auth)/profile-setup/page.tsx`
- [ ] `AssessmentPage` — `app/(auth)/assessment/page.tsx`

---

## Notes
- Background images are Figma CDN URLs (expire in 7 days). Move to `public/images/onboarding/` before production.
- Slide 2 content is inferred — update title/description once confirmed with design.
- Post-onboarding destination: `/` (main app discover page).
