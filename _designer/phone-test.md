# Phone test checklist

Things that pass tsc / eslint / `npm run build` but have **never been seen on a real phone**.
Test on the deployed https build (not `http://192.168.x.x` — share/clipboard behave differently
off a secure origin). Tick an item, note the date and device; delete the section once it's all green.

## 2026-09-24 — match page review fixes (`bfaffd7`, + follow-ups)

Needs: an organizer account and an **upcoming** match with at least one other confirmed player.

- [ ] **Remove a player — asks twice.** Tap a player's ✕ → a red «حذف {name}؟ دوباره بزن» covers
      the whole chip. A second tap removes them; «در حال حذف…» shows while it runs.
- [ ] **…with a long name** — the red confirm text wraps inside the chip, not clipped or overflowing.
- [ ] **…disarms on its own.** Tap ✕ once and wait ~4s → the chip goes back to normal.
- [ ] **One removal at a time.** While one chip says «در حال حذف…», the other chips' ✕ are dimmed and don't respond.
- [ ] **Removal failure shows.** (Hard to force — airplane mode after arming, then confirm) →
      «حذف بازیکن انجام نشد. دوباره تلاش کن.» under the grid.
- [ ] **No ✕ once the match is live or finished** (organizer view).
- [ ] **«ساخت لینک تازه» on iPhone** — tap once → red «مطمئنی؟…»; wait ~4s → back to grey
      «ساخت لینک تازه». (This used to stay armed forever on iOS.)
- [ ] **Replace the link for real** — two taps → «لینک تازه ساخته شد», and sharing afterwards
      sends a link that opens (old link should say it's invalid).
- [ ] **Hero share pill** opens the share sheet. (Its new «کپی نشد» label only appears with no
      share sheet *and* no clipboard — not reachable on a modern phone over https.)
- [ ] **Hero share pill width** — with ویرایش gone, the single pill spans the whole hero. Does it
      look right, or should it shrink/right-align? *(design call, audit MatchDetailsHeader #5)*
- [ ] **Cancelled match** — «این مَچ لغو شده است» pill is the **same height** as a normal status
      pill (compare with any upcoming match), no dial, no share, no CTA.

## 2026-09-24 — results submit (`6154dd0`)

Needs: a match that was **actually played** — 4 confirmed players by start time, otherwise the
server auto-cancels it. The organizer then gets «نهایی کردن نتیجه».

- [ ] Results page shows **one** card (no «+ افزودن بازی», no «بازی ۱» heading).
- [ ] «ثبت نهایی نتایج» is **greyed out** with caption «برای هر تیم دست‌کم یک بازیکن انتخاب کن»
      until each team has a player.
- [ ] Pick teams, enter sets, submit → «در حال ثبت…» → back on the match page.
- [ ] **Capture the result** for the developer: `scripts/api.sh GET /api/v1/matches/{id}/result`
      and paste the output. Its `status` / `myVote` values unblock the voting UI and the
      "result already submitted" state (today the match page keeps offering «نهایی کردن نتیجه»).
- [ ] Submit a second time → note what error text appears (expected: a refusal; we don't know its key yet).
