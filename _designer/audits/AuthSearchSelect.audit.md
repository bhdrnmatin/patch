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

### Status
Open: 4 (2 Warning, 2 Suggestion) | Fixed: 0 | Accepted: 1
