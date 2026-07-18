# Design Polish Pass — audit + plan (2026-07-12, branch `design/polish-pass`)

> **Outcome (2026-07-13):** Phases 1 (tokens) and 4 (motion) shipped. Phases 2
> (color discipline / tint demotions) and 3 (navy duotone imagery) were built,
> reviewed by the user, and **rejected** — solid-blue fills and the original
> imagery are the intended look. Reverted in the follow-up commit; do not redo.

Direction approved by user: **Stripe-inspired refinement** (light surfaces, one confident blue,
soft layered shadows, disciplined spacing), **keep the existing palette**, **navy tint treatment**
over the AI imagery, and **code becomes the source of truth** (deliberate departures from Figma
are allowed and documented here).

Before-screenshots: scratchpad `audit-before/` (18 routes, 390px, Playwright Firefox).

## Audit findings

### A. Imagery is the biggest inconsistency (user's own callout)
Five clashing AI art styles across the app, none in brand hues:
- Onboarding: photoreal player, red shirt, purple court, fire sparks
- Login: flat illustration, cyan shirt, lilac scene
- OTP: pink shirt, magenta/purple scene
- Assessment: photoreal, pink shirt, green ball
- Matches/Activity/Profile heroes + profile-setup: purple-shirt silhouette family
- Tournaments: hyper-saturated 3D podium (purple/gold)
- PromoCard: another distinct 3D athlete; court map: full-color Google map
- Tournament poster mock: grungy green/purple "LEVEL C" poster

**Fix (signature move):** one "night match" art direction — every image pulled into the
navy/brand-blue world via a CSS duotone-ish treatment (desaturate + navy multiply overlay +
blue gradient scrim), applied in the image-owning components. Works for any future image.

### B. Blue saturation overload / flat hierarchy
Solid `primary` is used for CTAs, info banners, icon circles, price pills, badges, chips,
and nav-active at once — on match details, six saturated blue blocks compete on one screen.
**Fix:** solid `bg-primary` reserved for the one primary action per screen; everything else
demoted to tint (`bg-primary/10` + `text-primary`) or ink.

### C. Hardcoded values that should be tokens
- Hexes in tsx: `#445A74` ×13 (profile meta + rules), `#F9F9F9`, `#33A3FF` (NavRow),
  `#E8F5E9`/`#2E7D32` (StatusBadge), `#00B86B` (JoinRequestRow accept), `#FF4869`
  (BottomNav dot), `#92A7C1` (ActivityCard).
- Arbitrary shadows in 8 files (6 distinct values) despite `shadow-card`/`shadow-pop`.
- Arbitrary radii ×14 (`20/24/28/32/40/48px`) despite `pill/card/group` tokens.
- One-off text sizes: `text-[10px]` ×7, 11px, 12px, 22px.
- Semantic status colors now have multiple consumers (green ×2 files, red ×1) —
  the 2026-06-08 "promote when a second consumer appears" condition is met.

### D. No motion at all
`BottomSheet` (all sort/filter/option/picker sheets) pops in with zero transition.
36 `active:opacity-*` press states exist but almost no `transition-*`, so presses snap.
No visible `focus-visible` treatment on most controls.

### E. Typography
Yekan Bakh ships 400/700 only; `font-medium`/`font-semibold` render synthesized weights.
Scale is mostly disciplined (xs/sm + tokens); a few arbitrary sizes (see C).

## Token additions (globals.css `@theme`)
- `--color-success: #00A868` / `--color-success-soft: #E8F5E9` — StatusBadge held pair +
  JoinRequestRow accept consolidate here
- `--color-danger: #FF4869` — notification dot, future destructive actions
- `--radius-sheet: 40px` + `--shadow-sheet` — BottomSheet one-offs, now tokenized
- Motion: rely on Tailwind defaults + `prefers-reduced-motion` guards; no new tokens

## Palette (unchanged, restated for the record)
`primary #33A3FF` · `ink #00254D` · `ink-soft #253343` · `muted #6783A0` ·
`surface #F5F7FA` · new semantic `success #00A868` / `danger #FF4869`

## Type roles
Single family (Yekan Bakh — Persian constraint): display = 700 at token sizes,
body = 400 `text-sm`, captions = 400 `text-xs text-muted`. Weight+color carry hierarchy,
not size proliferation. Synthesized 500/600 eliminated where visible.

## Phases
1. **Token hygiene** — add tokens above, sweep all hardcoded values. No visual redesign.
2. **Color discipline** — tint demotions, one solid CTA per screen.
3. **Imagery** — navy duotone treatment in AuthSlide/StorySlide/SportPageHeader/
   MatchDetailsHeader/ProfileHero/PromoCard + map/poster.
4. **Micro-interactions** — sheet slide-up/backdrop fade, press transitions, focus-visible,
   reduced-motion respected.
5. **Verify + document** — after-shots of all 18 routes, tsc+lint, docs, commit.

## Self-critique (vs. generic defaults)
The generic move here would be "add more gradients and glass" or a wholesale Linear-dark
reskin. Chosen instead: subtract saturation, unify imagery under one athletic navy signature,
and let the existing blue breathe. The one aesthetic risk: duotoning *all* imagery including
the tournament poster content — posters lose their own branding in list view, which is
accepted (they read as content, not ads, and detail pages can show originals later).
