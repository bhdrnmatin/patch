# Changelog

All notable changes to this design system are documented here.
Dates are in YYYY-MM-DD format. Newest entries first.

---

## Unreleased
*(changes not yet tagged/deployed)*

- [Tokens] Added neutral-scale tokens to `@theme`: `ink` #00254D, `ink-soft` #253343, `muted` #6783A0, `surface` #F5F7FA, `divider` #E5EAF0, `edge` #D0DDEC — all hardcoded gray hexes across Matches/profile/nav components replaced with token classes (no visual change)
- [Tokens] StatusBadge green pair, sheet radii, and shadows reviewed and accepted as one-offs (see TODO.md)
- [BottomNav] Plus button now opens the AddMenu speed dial (Figma 20211:6526): blurred dim backdrop, three glass action rows — ساخت تورنومنت / ساخت مسابقه / رزرو زمین — closing on backdrop tap, Escape, or selection; new `WhistleIcon` / `CourtIcon` inline icons (breaking: plus no longer links to /courts)
- [Patterns] AddMenu spec, HTML prototype, and audit in `patterns/`

---

## 2026-06-10

### Added
- Matches flow: `/matches` page with hero header, date selector, match cards, and Sort/Filter bottom sheets
- 15 Matches components in `app/(main)/matches/_components/`: `icons`, `IconButton`, `DateCell`, `StatusBadge`, `PlayerSlot`, `MetaItem`, `PriceTag`, `SelectChip`, `DateSelector`, `MatchCard`, `MatchesHeader`, `FilterSection`, `BottomSheet`, `SortSheet`, `FilterSheet`
- `MatchListItem` / `MatchStatus` types in `lib/types.ts`; mock matches and dates in `lib/mock`
- [Tokens] Yekan Bakh font as local OTFs (weights 400/700) via `next/font/local`

### Changed
- [Tokens] App font switched from Vazirmatn (Google Fonts) to Yekan Bakh — CSS variable renamed `--font-vazirmatn` → `--font-yekan-bakh`; replace any `var(--font-vazirmatn)` usage (breaking)
- All pages constrained to a centered `max-w-[430px]` column with black body backdrop, so the mobile frame is visible on desktop viewports
- [BottomNav] Centered to the 430px frame; hidden behind open sheets (sheets sit at `z-[60]`)

### Fixed
- [BottomSheet] Dialog accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape-to-close, body scroll lock (QA pass)
- [FilterSection] Added `role="group"` + `aria-label` (QA pass)
- [MatchCard / SelectChip] Arbitrary radii replaced with token classes (`rounded-card`, `rounded-full`)

---

## 2026-06-08

### Added
- `npm run optimize-images` script

### Changed
- [ProfileHero] Two-layer image and repositioned title/edit button to match Figma
- [BottomNav] Rebuilt as floating glassmorphic tabbar per Figma
- [ProfileMeta] Reordered to level/city/side; colon moved into label
- Profile typography aligned with Figma
- All auth/onboarding/profile images and icons localized from Figma CDN into `public/`; backgrounds optimized to WebP ≤1280px (~30MB → 1.4MB)

---

## 2026-06-07

### Added
- Profile section: `ProfileHero`, `ProfileAvatar`, `ProfileMeta`, `StatsGrid`, `StatCard`, `NavRow`, `PageHeader`, `SubPageLayout`, main `/profile` page and 5 sub-pages (edit, statistics, settings, support, rules)

---

## 2026-06-03

### Added
- Sign-up/login flow: `/login`, `/otp`, `/profile-setup`, `/assessment` pages
- Auth components: `AuthInput`, `OtpBox`, `OtpInput`, `RadioOption`, `RadioGroup`, `AuthActions`, `AuthCard`, `AuthSlide`
- [Tokens] Design token system in `app/globals.css` `@theme` (Tailwind v4) — colors, radii, blurs, font sizes; all auth/onboarding components refactored to token classes

### Changed
- [Button] Renamed from `OnboardingButton` and moved to shared `app/(auth)/_components/` (breaking)
- Auth pages made fluid: `w-full min-h-dvh` frames, responsive card width

### Fixed
- QA pass across auth components: all critical issues
- [RadioOption] Single dividers, correct selected state, circle on right
- Profile-setup labels: correct names, shown above input, Figma typography
- Blank pages; onboarding actions moved inside `StoryCard`

---

## 2026-06-02 — Initial build

### Added
- Onboarding flow (4 RTL Persian story slides): `ProgressBar`, `StoryCard`, `OnboardingActions`, `StorySlide`
- App scaffold: route groups `(auth)` / `(main)`, `BottomNav`, placeholder pages
- PWA mobile-first rules (390px viewport, 44px touch targets) in project conventions
