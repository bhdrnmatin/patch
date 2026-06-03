@AGENTS.md

# CLAUDE.md

## Project Context

**Patch** is a Progressive Web App (PWA) for padel and tennis players.
- **Primary target: mobile phones.** Design and build for a ~390px viewport first. Desktop is not a use case.
- All UI should feel native-mobile: touch targets ≥ 44px, no hover-only interactions, no desktop-only layouts.
- Frame components at 390×845px (Figma canvas size). Use `max-w-[390px]` containers where applicable.

## Component Library

Check these before writing new UI — reuse first.

**Shared auth** — `app/(auth)/_components/`
- `Button` — pill button, `variant: ghost | primary`, `fullWidth?`, h-12 (48px)
- `AuthInput` — RTL text input, `showLabel?`, `numeric?`, `maxLength?`, `placeholder?`
- `AuthCard` — glassmorphic bottom card, `title`, `subtitle?`, `children`, w-362px
- `AuthSlide` — full-screen frame: bg image + status bar spacer + children slot
- `AuthActions` — button row: full-width primary or ghost(قبلی)+primary, `onBack?`
- `OtpBox` — single OTP digit cell, `state: empty | active | filled`
- `OtpInput` — row of 5 `OtpBox` with keyboard focus management
- `RadioOption` — RTL radio row, `selected?`, dark bg / blue circle when selected
- `RadioGroup` — radio list container with dividers, `options[]`, `value`, `onChange`

**Onboarding** — `app/(auth)/onboarding/_components/`
- `ProgressBar` — 4-segment RTL indicator, `total`, `current` (0-indexed)
- `StoryCard` — glassmorphic bottom card, fixed 362×198px, RTL text
- `OnboardingActions` — button row (skip+next or full-width CTA), `isLast`
- `StorySlide` — full-screen slide layout, composes all of the above

**Main app** — `app/(main)/_components/`
- `BottomNav` — fixed bottom nav, 5 items, 56px tall, active state via `usePathname`

## Localization

This is a **Persian-language app**. All numbers displayed or entered in the UI must use Persian digits (۰–۹), not Latin (0–9).
- Use `toPersianDigits(value)` from `lib/persian.ts` whenever converting or displaying numeric strings.
- Apply it in `onChange` handlers for any input that accepts numbers, and when rendering numeric values in JSX.
- Persian placeholder examples: `۰۹۱۲۳۴۵۶۷۸۹`, not `09123456789`.

## Design Tokens

No `tokens.css` — values are inline. Reference when building new components:
- **Primary blue:** `#33A3FF`
- **Card bg:** `bg-black/50 backdrop-blur-[3.5px]`
- **Ghost button:** `bg-black/[0.19] border border-white/15`
- **Progress active:** `bg-white` · inactive: `bg-white/20`
- **Font (Persian):** Vazirmatn → `var(--font-vazirmatn)` · apply `dir="rtl"` on text containers
- **Slide frame:** 390×845px

## Routing

```
/(auth)/onboarding     → onboarding story slides (4 slides)
/(auth)/login          → phone number entry
/(auth)/otp            → OTP code entry
/(auth)/profile-setup  → name / city / gender form
/(auth)/assessment     → 5-step skill survey
/(main)/               → discover (placeholder)
/(main)/matches        → placeholder
/(main)/leagues        → placeholder
/(main)/tournaments    → placeholder
/(main)/courts         → placeholder
/profile               → placeholder
```

## Data

- Types: `lib/types.ts` — `Sport`, `SkillLevel`, `Player`, `Match`, `League`, `Tournament`, `Court`
- Mock data: `lib/mock/index.ts`

---

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
