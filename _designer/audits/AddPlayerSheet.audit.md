# AddPlayerSheet — Audit

Teammate-row filler for step ۴ of the create-match wizard: a menu (pick from Patch
players / invite a phone number / remove) plus a phone-entry view, in one
`BottomSheet`. `app/matches/create/_components/AddPlayerSheet.tsx`.

## v1 — 2026-08-08 | audit

Feature composite (controlled by `StepPlayers`, like `OptionSheet` / `PlayerPickerSheet`),
not a reusable primitive — so the Props-API rules (extend native attrs, forwardRef,
`cn`, `className` passthrough) don't apply, consistent with the StepSchedule and
RadioCardGroup audits. Token-clean throughout (`rounded-group`/`rounded-card`/`rounded-pill`,
`border-edge`, `shadow-card`, `text-ink`/`ink-soft`/`muted`/`danger`, `bg-primary`) — no
hardcoded hex or px. Icons are `currentColor` + `aria-hidden`. RTL follows the CLAUDE.md
flex trap: LTR wrappers, `dir="rtl"` on the text nodes only. `disabled:opacity-40` on the
submit matches project convention. Global `:focus-visible` (globals.css:75) covers focus.
Stays mounted and resets view/phone during render on the closed→open transition — the
sanctioned React pattern, and what stopped the sheet flashing open/shut.

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | **The Iranian-mobile rule now exists twice, in two notations.** `/login` tests the raw Persian-digit value (`/^۰۹[۰-۹]{9}$/`, `app/(auth)/login/page.tsx:23`); this sheet converts with `toLatinDigits` then tests `/^09\d{9}$/`. Same rule, two implementations — they will drift the first time the format changes (+98, or 9xxxxxxxxx without the leading zero). Extract one `isValidMobile()` (digit-set agnostic) and have both call it. | Open → TODO.md |
| 2 | Warning | **The validation failure is silent to a screen reader.** The message under the field swaps between hint and error as the user types, and the افزودن button flips `disabled`, but the input carries no `aria-invalid`, the message isn't linked with `aria-describedby`, and nothing is in a live region — so a SR user hears neither the error nor why submit stopped working (Rule 4.5). Needs `aria-invalid`/`aria-describedby` support on `TextField` (it currently takes `label`/`value`/`onChange`/`placeholder`/`numeric` only). | Open |
| 3 | Suggestion | Action buttons (بازگشت / افزودن) sit in the sheet body; `BottomSheet` has a `footer` prop and both sibling sheets (`SortSheet`, `FilterSheet`) use it. Inconsistent placement for the same job. | Open |
| 4 | Suggestion | Switching to the phone view doesn't move focus to the input, so on a phone the keyboard needs a second tap. An `autoFocus` (or a focus call on view change) would make the invite path one gesture shorter. | Open |
| 5 | Suggestion | `slotLabel` and the header comment ("How a teammate slot gets filled") are stale vocabulary — step ۴ moved from three fixed slots to a growing row list. Rename to `rowLabel`. | Open |
| 6 | Suggestion | `MenuRow` duplicates `RadioCardGroup`'s option-card idiom (white card, icon right, title + description, `rounded-group` + `shadow-card`). Two instances is not yet worth a shared component with a `variant` prop — revisit if a third appears. | Open |
| 7 | Suggestion | The destructive حذف این بازیکن sits immediately below two add rows with no confirmation. Undo is cheap (re-add), but the adjacency invites a mis-tap; separating it or moving it to the row itself would be safer. | Open |
| 8 | Accepted | Shared `Button` (`app/(auth)/_components/Button.tsx`) not reused for the action pair | Accepted — its `ghost` variant is dark-glass (`bg-black/[0.19]`, `border-white/15`) built for the auth slides; there's no light variant for a white sheet. Revisit if `Button` grows one. |
| 9 | Accepted | Custom `onInvite(phone)` / `onClear()` callbacks rather than native event handlers | Accepted — matches every other wizard component (RadioGroup, AuthSelect, all step composites). |
| 10 | Note | Phone conversion verified against Persian input: `۰۹۱۲۳۴۵۶۷۸۹` → valid; too short, wrong prefix and too long all rejected. | Clean |

## v2 — 2026-08-08 | fix

The Patch-player picker wouldn't open on device. Cause: it was a *second* `BottomSheet`,
so switching to it ran one sheet's cleanup (`history.back()`, async) and the other's setup
(`pushState`) in the same commit — the same history churn that produced the earlier
open/shut flash. The player list is now a third **view inside this sheet**: exactly one
sheet is ever open and no history entry is torn down mid-interaction.

- `PlayerPickList` extracted from `PlayerPickerSheet` (`app/matches/[id]/results/_components/`)
  and used by both, so the rows aren't duplicated. `PlayerPickerSheet` keeps its API — the
  results page is untouched.
- Editing an existing row now opens on the view it came from: the prefilled phone form for
  an invite, the player list for a Patch player, the menu for an empty row.
- Finding #3 (actions in body vs `BottomSheet` footer) now also covers the players view's
  بازگشت button; #6 (MenuRow ≈ RadioCardGroup card) unchanged.

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 11 | Warning | Chaining two BottomSheets breaks on device — one sheet's history cleanup races the other's push | Fixed v2 — single sheet, three views |
| 12 | Suggestion | Props are up to 10 (`players`/`disabledPlayers`/`selectedPlayer`/`onPickPlayer` added). Rule 5.3 suggests compound composition at 10+; acceptable for a feature composite driven by one parent, but it's the ceiling. | Open |

### Status
Open: 0 Critical, 2 Warning, 6 Suggestion | Fixed: 1 | Accepted: 2
