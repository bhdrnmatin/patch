# AuthSelect — Audit

Inline dark-glass dropdown (short lists, e.g. gender). `app/(auth)/_components/AuthSelect.tsx`.

## v1 — 2026-07-22 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Listbox not keyboard-navigable — `role="listbox"` with option `<button>`s, but no ArrowUp/Down/Home/End nav and no `aria-activedescendant`. Usable via Tab+Enter, but not a conformant listbox/combobox. | Open |
| 2 | Suggestion | Trigger has `aria-haspopup="listbox"` but no `aria-controls` linking it to the `<ul>` (no id on the list). | Open |
| 3 | Suggestion | Opens on click only; no ArrowDown-to-open on the trigger. | Open |
| 4 | Accepted | Custom `onChange(value: string)` (not native `ChangeEventHandler`) | Accepted — matches AuthInput / project pattern |
| 5 | Accepted | Hardcoded black/white opacities (`bg-black/[0.32]`), `focus:outline-none` + border indicator | Accepted — consistent with AuthInput audit |

Note: outside-click (pointerdown) + Escape close are correct; selected option marked `aria-selected` + `text-primary`.

### Status
Open: 3 (1 Warning, 2 Suggestion) | Fixed: 0 | Accepted: 2
