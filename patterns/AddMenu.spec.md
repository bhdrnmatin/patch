# AddMenu — Composite Spec

Speed-dial menu opened by the plus button in `BottomNav`. Figma node `20211:6526`
(menu group `20281:11542`). Dim-blurs the page, keeps the nav visible, and shows
three create/reserve actions anchored above the nav.

## Anatomy

AddMenu
├── Backdrop            [inline: fixed overlay, closes on tap]
├── ActionRow ×3        [inline: glass pill — label + icon circle]
│   ├── WhistleIcon     [inline in BottomNav.tsx — "ساخت تورنومنت"]
│   ├── MatchesIcon     [existing in BottomNav.tsx — "ساخت مسابقه"]
│   └── CourtIcon       [inline in BottomNav.tsx — "رزرو زمین"]
└── BottomNav           [existing: app/(main)/_components/BottomNav.tsx — stays visible above backdrop]

## Layout

- Backdrop: `fixed inset-0 z-40 bg-black/45 backdrop-blur-[4px]` — below the nav (`z-50`), above page content.
- Menu container: `absolute bottom-full mb-4 left-6 right-6 flex flex-col gap-2` inside the `<nav>`
  (Figma: bottom 92px = nav bottom inset 24px + pill 52px + 16px gap; insets 24px = nav `px-6`).
- Action row: `flex items-center justify-end gap-3 w-full p-1 rounded-full bg-white/10 border border-white/20`.
- Row label: `text-sm font-semibold leading-4 text-white`, `dir="rtl"` — sits left of the icon circle (RTL).
- Icon circle: `size-10 rounded-full bg-white/30 text-white` with a 24px `currentColor` icon.
- Row order top→bottom: ساخت تورنومنت → ساخت مسابقه → رزرو زمین.

## Notes

- The plus button is a `<button>` with `aria-expanded`; tapping it toggles the menu.
- Close on: backdrop tap, Escape key, or choosing an action.
- Create flows don't exist yet — actions link to the section pages
  (`/tournaments`, `/matches`, `/courts`) as interim destinations.
- Figma's tabbar pill tint differs slightly in this state (`bg-white/35`); not replicated —
  the existing nav styling is kept.

## AI Agent Instructions

Implement **AddMenu** with React + TypeScript + Tailwind (already done in
`app/(main)/_components/BottomNav.tsx` — this section documents the contract).

### Components
- `BottomNav` — existing; owns `menuOpen` state, backdrop, and menu.
- `WhistleIcon`, `CourtIcon` — inline 24×24 `fill="currentColor"` SVGs in BottomNav.tsx.
- `MatchesIcon` — reused for the create-match row.

### Behaviour
- Plus button: `onClick` toggles `menuOpen`; `aria-label="افزودن"`, `aria-expanded={menuOpen}`.
- Backdrop `onClick` and `Escape` keydown set `menuOpen` false; each action row
  closes the menu on click before navigating (Next `Link`).
- No scroll lock (the menu is dismissible, not a modal dialog).

### Layout
Use only token / standard Tailwind classes as listed under **Layout** above —
no arbitrary values except `backdrop-blur-[4px]` (matches Figma; no blur token at 4px).
