# Graph Report - .  (2026-06-02)

## Corpus Check
- Corpus is ~3,020 words - fits in a single context window. You may not need a graph.

## Summary
- 142 nodes · 172 edges · 22 communities (12 shown, 10 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.88)
- Token cost: 8,400 input · 3,650 output

## Community Hubs (Navigation)
- [[_COMMUNITY_TypeScript Compiler Config|TypeScript Compiler Config]]
- [[_COMMUNITY_Main Nav & Route Pages|Main Nav & Route Pages]]
- [[_COMMUNITY_Domain Data Model|Domain Data Model]]
- [[_COMMUNITY_Onboarding Component Layer|Onboarding Component Layer]]
- [[_COMMUNITY_Onboarding AST Files|Onboarding AST Files]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_App Root & Fonts|App Root & Fonts]]
- [[_COMMUNITY_Dev Tooling|Dev Tooling]]
- [[_COMMUNITY_Project Docs & Design Tokens|Project Docs & Design Tokens]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Globe Icon|Globe Icon]]
- [[_COMMUNITY_Window Icon|Window Icon]]
- [[_COMMUNITY_ESLint Config (duplicate)|ESLint Config (duplicate)]]
- [[_COMMUNITY_Next.js Config (duplicate)|Next.js Config (duplicate)]]
- [[_COMMUNITY_File Icon|File Icon]]
- [[_COMMUNITY_Next.js Logo|Next.js Logo]]
- [[_COMMUNITY_Vercel Logo|Vercel Logo]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Player` - 9 edges
3. `MainLayout()` - 8 edges
4. `Sport` - 8 edges
5. `Domain Type Definitions` - 8 edges
6. `Match` - 7 edges
7. `OnboardingPage()` - 6 edges
8. `League` - 6 edges
9. `navItems (BottomNav route config)` - 6 edges
10. `Mock Data Layer` - 6 edges

## Surprising Connections (you probably didn't know these)
- `postcss config` --conceptually_related_to--> `Inline Design Tokens`  [INFERRED]
  postcss.config.mjs → CLAUDE.md
- `OnboardingPage()` --references--> `AuthLayout()`  [INFERRED]
  app/(auth)/onboarding/page.tsx → app/(auth)/layout.tsx
- `Glassmorphic Card Pattern (bg-black/50 backdrop-blur)` --conceptually_related_to--> `PWA Mobile-First (390px viewport)`  [INFERRED]
  app/(auth)/onboarding/_components/StoryCard.tsx → app/layout.tsx
- `Mock Data Layer` --semantically_similar_to--> `Domain Type Definitions`  [INFERRED] [semantically similar]
  lib/mock/index.ts → lib/types.ts
- `CourtsPage()` --references--> `MainLayout()`  [INFERRED]
  app/(main)/courts/page.tsx → app/(main)/layout.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Onboarding Slide Composition: StorySlide composes ProgressBar, StoryCard, OnboardingActions** — _components_storyslide_storyslide, _components_progressbar_progressbar, _components_storycard_storycard, _components_onboardingactions_onboardingactions [EXTRACTED 1.00]
- **Main App Route Group: MainLayout wraps all main pages via BottomNav** — main_layout_mainlayout, _components_bottomnav_bottomnav, main_page_discoverpage, courts_page_courtspage, leagues_page_leaguespage, matches_page_matchespage, tournaments_page_tournamentspage [EXTRACTED 1.00]
- **RTL Persian UI Pattern: Vazirmatn font + dir=rtl used across onboarding components** — layout_vazirmatn_font, concept_rtl_persian_ui, _components_storycard_storycard, _components_progressbar_progressbar, _components_onboardingbutton_onboardingbutton [EXTRACTED 1.00]
- **Domain Data Model: Types and Mock Data** — lib_types_player, lib_types_match, lib_types_league, lib_types_tournament, lib_types_court, mock_index_players, mock_index_matches, mock_index_leagues, mock_index_tournaments, mock_index_courts [EXTRACTED 1.00]
- **React Query Provider Setup** — app_providers, app_providers_queryclient, concept_react_query_stale_time [EXTRACTED 1.00]
- **Project Configuration Stack** — package_json, tsconfig_json, next_config_ts, postcss_config_mjs, eslint_config_mjs [INFERRED 0.95]

## Communities (22 total, 10 thin omitted)

### Community 0 - "TypeScript Compiler Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "Main Nav & Route Pages"
Cohesion: 0.15
Nodes (9): BottomNav, navItems (BottomNav route config), navItems, CourtsPage(), LeaguesPage(), MainLayout(), DiscoverPage(), MatchesPage() (+1 more)

### Community 2 - "Domain Data Model"
Cohesion: 0.39
Nodes (14): Domain Type Definitions, Mock Data Layer, Court, League, Match, Player, SkillLevel, Sport (+6 more)

### Community 3 - "Onboarding Component Layer"
Cohesion: 0.19
Nodes (13): OnboardingActions, OnboardingButton, ProgressBar, StoryCard, StorySlide, AuthLayout(), Glassmorphic Card Pattern (bg-black/50 backdrop-blur), PWA Mobile-First (390px viewport) (+5 more)

### Community 4 - "Onboarding AST Files"
Cohesion: 0.13
Nodes (5): OnboardingActionsProps, OnboardingButtonProps, ProgressBarProps, StoryCardProps, StorySlideProps

### Community 5 - "NPM Dependencies"
Cohesion: 0.13
Nodes (14): dependencies, next, react, react-dom, @tanstack/react-query, @tanstack/react-query-devtools, name, private (+6 more)

### Community 6 - "App Root & Fonts"
Cohesion: 0.20
Nodes (5): geistSans, metadata, vazirmatn, QueryClient, React Query staleTime Configuration

### Community 7 - "Dev Tooling"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 8 - "Project Docs & Design Tokens"
Cohesion: 0.33
Nodes (3): Inline Design Tokens, Next.js Version Breaking Changes Warning, postcss config

## Knowledge Gaps
- **58 isolated node(s):** `OnboardingActionsProps`, `OnboardingButtonProps`, `ProgressBarProps`, `StoryCardProps`, `StorySlideProps` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PWA Mobile-First (390px viewport)` connect `Onboarding Component Layer` to `Project Docs & Design Tokens`, `Main Nav & Route Pages`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `MainLayout()` connect `Main Nav & Route Pages` to `Onboarding Component Layer`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `MainLayout()` (e.g. with `CourtsPage()` and `LeaguesPage()`) actually correct?**
  _`MainLayout()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `OnboardingActionsProps`, `OnboardingButtonProps`, `ProgressBarProps` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Onboarding AST Files` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._