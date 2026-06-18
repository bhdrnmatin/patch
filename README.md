# Patch

A Progressive Web App (PWA) for padel and tennis players — find matches,
leagues, tournaments, and courts. The app is **Persian-language** and
**mobile-first**: it's designed and built for a ~390px phone viewport.

## Getting Started

Prerequisites: **Node.js 20+** and npm.

```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> Because Patch targets phones, view it in your browser's device/responsive
> mode at a ~390px width (e.g. iPhone) — desktop is not a supported layout.

## Routes — where to look

**Reachable from the bottom nav / UI**

| URL | Screen | |
|---|---|---|
| `/` | کاوش — Discover | placeholder |
| `/matches` | مسابقات — Matches list | |
| `/tournaments` | تورنومنت — Tournaments list | |
| `/courts` | رزرو زمین — Courts (via the **+** menu) | placeholder |
| `/profile` | پروفایل — Profile (+ `/profile/edit`, `/rules`, `/settings`, `/statistics`, `/support`) | |

**Direct URL only** (built, but not linked from the UI yet)

| URL | Screen |
|---|---|
| `/activity` | Activity feed |
| `/leagues` | Leagues (placeholder) |
| `/matches/[id]` | Match detail — e.g. **`/matches/1`** (any id; the mock returns one match). Not linked from match cards yet. |

The match-detail screen is a preview harness driven by query params — it has no
real state yet, so you pick the view via the URL:

- `role` = `creator` (default) or `player`
- `status` = `upcoming` (default), `live`, or `finished`

Examples:
- Creator, live (result-entry CTA): `/matches/1?status=live`
- Player, finished: `/matches/1?role=player&status=finished`

**Auth flow** (start here, each step advances to the next):
`/onboarding` → `/login` → `/otp` → `/profile-setup` → `/assessment` → `/`

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run optimize-images` | Optimize images in `public/images` |

## Tech

Next.js (App Router) · React · Tailwind CSS · TanStack Query (React Query).
The API is not yet available; pages read mock data through accessors in
`lib/data/`, which are the swap point for the real endpoints.

## Architecture & conventions

See **[CLAUDE.md](./CLAUDE.md)** and **[AGENTS.md](./AGENTS.md)** for the
component library, design tokens, RTL/localization rules, and routing.
