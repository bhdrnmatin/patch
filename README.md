# Patch

A Progressive Web App (PWA) for padel and tennis players — find matches,
leagues, tournaments, and courts. The app is **Persian-language** and
**mobile-first**: it's designed and built for a ~390px phone viewport.

## Getting Started

### Option A — Docker (recommended, no Node.js required)

Prerequisites: **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (Mac / Windows / Linux).

```bash
git clone https://github.com/bhdrnmatin/patch.git
cd patch
docker compose up --build
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Option B — Node.js

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
| `scripts/api.sh` | Authenticated curl against the live API, token refresh handled |

`scripts/api.sh` exists because every endpoint but `/v3/api-docs` and `/clubs` needs a
bearer, and access tokens expire after 15 minutes:

```
scripts/api.sh login <phone>          # sends an OTP
scripts/api.sh verify <phone> <code>  # stores access + refresh (consumes the code)
scripts/api.sh GET  /api/v1/matches
scripts/api.sh POST /api/v1/matches '{"title":"…"}'
```

The session is written to `.api-session.json`, which is gitignored — it holds a real
refresh token, so don't commit or paste it.

## Tech

Next.js (App Router) · React · Tailwind CSS · TanStack Query (React Query).
Pages read mock data through accessors in `lib/data/`, which are the swap point for
the real endpoints. The live API (`api.patchapp.ir`) covers auth, player profile,
clubs and matches; only auth and profile are wired so far — the clubs and matches
tables are still empty, so the rest stays on mocks.

## Architecture & conventions

See **[CLAUDE.md](./CLAUDE.md)** and **[AGENTS.md](./AGENTS.md)** for the
component library, design tokens, RTL/localization rules, and routing.
