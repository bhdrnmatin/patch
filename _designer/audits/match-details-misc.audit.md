# Match Details — misc base components — Audit

## v1 — 2026-06-10 | audit
Components audited clean (props, tokens, states, a11y, architecture):
`ActionPill` (border-[1.5px] consistent with sheet footers), `InfoItem`, `InfoBanner`,
`StageDial` (SVG ring, token strokes, visible text), `PlayerChip` (leading-[11px] Figma
structural), `DescriptionCard`, `ShareCard`, `FaqSection`, `JoinRequestsSection`,
`MatchCtaBar`, `icons` (currentColor + aria-hidden throughout), `MatchDetailsPage`.

Systemic (Confirmed ✓, prior accepted deviations): no cn()/cva/forwardRef/native-attr
extension on feature presentational components; `<img>` over `next/image`;
no focus-visible ring convention in the project (touch-first PWA).

### Status
Open: 0 | Fixed: 0 | Accepted: 3 (systemic)
