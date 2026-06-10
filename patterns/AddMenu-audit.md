# AddMenu — Pattern Audit

## Figma Translation
| Figma element | Code equivalent |
|---------------|-----------------|
| Backdrop `20211:6655` (`bg rgba(0,0,0,0.45)` + blur 4) | inline `div` — `fixed inset-0 z-40 bg-black/45 backdrop-blur-[4px]` |
| Menu group `20281:11542` (bottom 92, x 24, w 342, gap 8) | `absolute bottom-full mb-4 left-6 right-6 flex flex-col gap-2` inside `<nav>` |
| Action row (`bg white/10`, border `white/20`, r 56, p 4) | `Link` — `flex items-center justify-end gap-3 p-1 rounded-full bg-white/10 border border-white/20` |
| Row label (Yekan Bakh SemiBold 14/16, white) | `span` — `text-sm font-semibold leading-4 text-white` `dir="rtl"` |
| Icon circle (`bg white/30`, r 40, p 8, 24px icon) | `span` — `size-10 rounded-full bg-white/30 text-white` |
| `Custome Icon` Union (tournament) | `WhistleIcon` inline SVG, `fill="currentColor"` |
| `Custome Icon` Vector (match ball) | existing `MatchesIcon` (identical path) |
| `Custome Icon` Vector (court) | `CourtIcon` inline SVG, `fill="currentColor"` |
| Tabbar add button (still plus, opacity 95) | existing add `<button>` unchanged, now toggles `menuOpen` |

## Token Usage
| Tailwind class | CSS variable | Used for |
|----------------|-------------|----------|
| bg-primary | var(--color-primary) | add button background |
| text-ink-soft | var(--color-ink-soft) | inactive tab icons (unchanged) |
| bg-black/45, bg-white/10, bg-white/20, bg-white/30 | Tailwind core opacity colors | backdrop + glass rows |
| rounded-full | Tailwind core | row pills, icon circle |
| gap-2 / gap-3 / mb-4 / p-1 | Tailwind core spacing | menu gaps, row padding |

Deviations: `backdrop-blur-[4px]` arbitrary (no 4px blur token; Figma exact);
row height 40px < 44px touch-target guideline, but rows are full-width (accepted, matches Figma);
Figma row radius 56px rendered as `rounded-full` (identical appearance on a 40px pill).
