## v1 — 2026-06-08 | audit + refactor

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 1 | Critical | Modal was a plain `<div>` overlay — no `role="dialog"`, `aria-modal`, or labelling; screen readers couldn't identify it. | Fixed v1 — added `role="dialog"`, `aria-modal`, `aria-labelledby` (useId on title). |
| 2 | Critical | No keyboard dismiss (Escape) and no body scroll lock (rule 4.8) — page scrolled behind the open sheet. | Fixed v1 — Escape listener + `document.body.style.overflow` lock in an effect; panel focused on open. |
| 3 | Warning | Full-screen overlay was a `<button aria-label="بستن">`, duplicating the close button's label for SR. | Fixed v1 — overlay is now `aria-hidden` div with `onClick`; the `<button>` X handles keyboard. |
| 4 | Suggestion | Badge glyph beside title was announced; it's decorative. | Fixed v1 — `aria-hidden` on badge span. |
| 5 | Token gap | `rounded-[40px]`, `rounded-[20px]`, `shadow-[…]` have no token. | → TODO.md (accepted for now). |

Regression check: n/a (v1)

### Status
Open: 0 | Fixed: 4 | Accepted: 1
