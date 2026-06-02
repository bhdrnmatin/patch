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

## Notes
- Background images are Figma CDN URLs (expire in 7 days). Move to `public/images/onboarding/` before production.
- Slide 2 content is inferred — update title/description once confirmed with design.
- Post-onboarding destination: `/` (main app discover page).
