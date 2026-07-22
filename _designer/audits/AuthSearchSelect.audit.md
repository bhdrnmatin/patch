# AuthSearchSelect — Audit

Full-screen searchable picker (long lists: province/city), rendered via portal.
`app/(auth)/_components/AuthSearchSelect.tsx`.

## v1 — 2026-07-22 | audit
| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Warning | Full-screen overlay is a modal but lacks dialog semantics — no `role="dialog"` + `aria-modal="true"` + accessible name, and no focus trap, so keyboard focus can leave into the (inert) page behind it. | Open |
| 2 | Warning | Options list has the same keyboard-nav gap as AuthSelect — `role="listbox"` with `<button>` options, no Arrow/Home/End nav or `aria-activedescendant`. | Open (systemic w/ AuthSelect) |
| 3 | Suggestion | Trigger `aria-haspopup="dialog"` has no `aria-controls`. | Open |
| 4 | Suggestion | `autoFocus` on the search input is good for a search modal, but with no focus trap the focus management is incomplete. | Open |
| 5 | Accepted | Hardcoded opacities / `focus:outline-none` + border | Accepted — matches auth pattern |

Note: Escape close, `overflow:hidden` body-scroll lock, backdrop, "موردی یافت نشد" empty state, and top-pinned search (keyboard-stable) are all correct/good.

## v2 — 2026-07-22 | refactor
Fixed all: #1 dialog semantics (`role="dialog"` + `aria-modal` + `aria-label`) + Tab focus trap; #2 Arrow/Home/End nav over options (ArrowDown from the search input enters the list); #3 `aria-controls` on the trigger; #4 focus trap completes the autoFocus management.

### Status
Open: 0 | Fixed: 4 | Accepted: 1
