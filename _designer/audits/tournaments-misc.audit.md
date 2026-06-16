# Tournaments misc (InfoPair, PosterBadge, TournamentPoster) — Audit

Small presentational sub-components of the Tournaments card.
Grouped per the `match-details-misc` precedent.

## v1 — 2026-06-16 | audit

### InfoPair — `tournaments/_components/InfoPair.tsx`
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Suggestion | `label: string` could be `ReactNode` to match `value`. | Open |
| 2 | Token gap | `text-[10px]`, `gap-[7px]` arbitrary (no 10px/7px token). | Accepted — DateCell `text-[10px]` precedent |

Display component (`value` is already `ReactNode` ✓). No interaction/a11y surface. Same shape as MetaItem (audited clean).

### PosterBadge — `tournaments/_components/PosterBadge.tsx`
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | `LABELS` map duplicates `StatusBadge`'s status→Persian map. Extract a shared `statusLabels`. | Open |
| 2 | Token gap | `backdrop-blur-[4px]`, `drop-shadow-[0px_0px_1px_...]` arbitrary. | Open (blur) / Accepted (drop-shadow one-off) |

Mirrors StatusBadge (audited clean) but with a dark-glass tone. `bg-black/25` over the poster makes the backdrop-blur meaningful here (unlike the card CTA).

### TournamentPoster — `tournaments/_components/TournamentPoster.tsx`
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Token gap | `rounded-[20px]` — 20px radius, no token (group 24 / card 32 / pill 44). | Open → TODO.md |
| 2 | Suggestion | `<img>` (not next/image). | Systemic — Confirmed ✓ (project-wide) |

`border-2 border-edge`, `aspect-square w-full` ✓. Decorative `alt=""` acceptable (title shown in card).

### Status
Open: 3 | Fixed: 0 | Accepted: 3

## v2 — 2026-06-16 | fix
| Component | # | Finding | Status |
|-----------|---|---------|--------|
| InfoPair | 1 | `label: string` → `ReactNode` | Fixed v2 |
| PosterBadge | 1 | Duplicated status→Persian `LABELS` | Fixed v2 — extracted to `lib/status.ts` (`statusLabels`); StatusBadge now imports it too |

Token gaps unchanged: `rounded-[20px]` (TournamentPoster) and `backdrop-blur-[4px]` (PosterBadge,
meaningful over the poster) **accepted as one-offs** — consistent with the project's single-use
radii/blur precedent (sheet 40px / close 20px). No new tokens added.

### Status
Open: 1 (TournamentPoster `<img>`, systemic) | Fixed: 2 | Accepted: 3
