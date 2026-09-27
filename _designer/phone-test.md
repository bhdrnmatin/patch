# Phone test checklist

Things that pass tsc / eslint / `npm run build` but have **never been seen on a real phone**.
Test on the deployed https build (not `http://192.168.x.x` — share/clipboard behave differently
off a secure origin). Tick an item, note the date and device; delete the section once it's all green.

## 2026-09-26 — Tehran time, results shape, contrast

- [ ] Create a match at ۱۸:۰۰ → the match page and /matches show ۱۸:۰۰ (not ۱۷:۳۰ or ۱۸:۳۰).
- [ ] Wizard schedule step opens with «امروز» selected; open the wizard and close it straight
      away → no «مَچ نیمه‌تمام دارید» bar next time; with a real saved
      draft, that bar still shows on open.
- [ ] Pull to refresh, **in Safari and in the installed PWA**: from the top of /matches, /activity,
      a match page and /profile, drag down → spinner appears; let go past it → page reloads; a short
      pull springs back. Doesn't fire mid-page, with a sheet open, or when swiping the day strip.
      Watch for any clash with iOS's own pull-to-refresh in the Safari tab.
- [ ] **New account** (a number never used): after the OTP you land on /matches, not the setup form;
      browsing matches and a match page works. Then each of these opens the setup form, and
      «شروع کنیم!» brings you back to where you were: ساخت مَچ (lands in the wizard), پیوستن on a
      match page, پیوستن on a /join link, پذیرفتن on an invitation. «بعدا» backs out every time
      (in the installed app too). رد کردن an invitation works *without* setup.
- [ ] Setup and profile edit: استان shows البرز and شهر shows کرج, both with a lock, neither opens.
      Saving either form, then check the profile: city is کرج.
- [ ] Developer: does the API itself refuse join/create for an incomplete profile? (unknown)
- [ ] Profile → edit → tap the avatar, pick a photo (camera and library): the cropper opens; one
      finger moves it, **two fingers pinch-zoom**, the slider zooms; the photo can't leave a gap in
      the circle; a dragged-down finger doesn't trigger pull-to-refresh. «تایید» → the new avatar is
      exactly the circled part, upright (check a portrait photo from the camera). «انصراف» uploads nothing.
- [ ] /matches date strip: yesterday and the day before are dark glass, today onward white — the
      difference is obvious at a glance, and the past digits are still readable.
- [ ] Match page برگشت goes to /matches from every way in: the list, /activity, a /join link,
      the wizard's «رفتن به مَچ».
- [ ] The wizard's earliest slot is a full hour ahead (at 8:10 the first is ۱۰:۰۰).
- [ ] Results (needs a match with 4 confirmed players, organizer): add a second game with
      «+ افزودن بازی», swap partners in it, remove one with its ✕. The CTA stays disabled (caption
      «۱ از ۲ بازی کامل شده») until every game has four players; submitting returns to the match page.
- [ ] The wizard opens quickly (no longer waits for the suggestions list); step ۴ → «از بین
      بازیکنان پچ» shows your already-played players (or «در حال بارگذاری...» for a moment).
- [ ] Wizard step ۱ «ظرفیت مَچ»: دوستانه shows a fixed ۴; آمریکانو starts at ۴ and +/− go 4…12 (the
      buttons fade at each end). Create an آمریکانو at 8 → the match page shows 8 seats. Lowering it
      after adding players on step ۴ drops the extras.
- [ ] Wizard players step: دوستانه stops adding at 3 teammates (caption «۴ نفره»), آمریکانو at 11;
      switching آمریکانو → دوستانه with 5 teammates keeps the first 3.
- [ ] Withdraw invite (organizer, upcoming match, invite someone from the wizard): «دعوت‌های ارسالی»
      shows them as «در انتظار پاسخ»; «پس گرفتن» removes the row; the invitee's /activity card goes.
- [ ] Secondary grey text and red error text look right (slightly darker than before); the login
      error text is still the bright red.
- [ ] Create actually succeeds at the new sizes: a دوستانه with 3 teammates, and a آمریکانو with
      5+ teammates (that one used to be sent with no cap — the API now allows up to 12).
- [ ] «دعوت‌های ارسالی» is **absent** when there's nothing pending, for a non-organizer, and once
      the match is live/finished.
- [ ] Players with no photo: the backend now sends its own default avatar
      (`media.patchapp.ir/defaults/player-avatar.jpg`) instead of nothing, so our silhouette no
      longer appears. Check it looks OK in player chips, the wizard's review, and /profile.
- [ ] Results submitted **before the match ends**: note what the API says (still unknown), and
      that the message under the card is Persian, not a `matchmaking.…` key.

## 2026-09-24 — /activity current vs past, no sort/filter

- [ ] /activity header has **no** filter/sort buttons (just the title); /matches still has both.
- [ ] Upcoming matches under «مَچ‌های شما», cancelled/finished under «مَچ‌های گذشته».

## 2026-09-24 — decline an invitation

Needs: an account with a **pending invitation** (invite its number from another account's wizard).
- [ ] /activity invitation card shows three buttons — مشاهده مَچ · رد کردن · پذیرفتن — all readable, none clipped.
- [ ] «رد کردن» → the card disappears (and the nav's activity dot drops if it was the last one).
- [ ] The organizer's side: can they re-invite the same number afterwards? (unknown — note what happens)
- [ ] Developer: capture the declined invitation's `status` value (`scripts/api.sh GET /api/v1/matches/invitations/me`).

## 2026-09-24 — speed (clubs cached, list no longer waits on /activity) — faster on LAN dev ✓

- [x] /matches: public matches appear quickly; your private ones may pop in ~1s later (that is
      expected — `/activity` is the slow call).
- [ ] Opening a match is faster the second time onwards (clubs are fetched once per session).
- [ ] Judge speed on **patchapp.ir after deploy**, not the LAN dev server — dev mode is much slower.

## 2026-09-24 — private matches in the list (verified on iPhone ✓)

- [x] Create a **private** match → it appears in **/matches** (all matches) for you, the organizer.
- [x] It also appears in **/activity** under «مَچ‌های شما». (The live API returns it and the app's
      mapping shows it; a match from before the afternoon backend reset is gone for good.)
- [ ] Someone else who isn't in it does **not** see it in /matches.

## 2026-09-24 — create-match review avatars (verified on iPhone ✓)

- [x] Review step «اعضا»: the **شما** row shows your own profile photo (if you have one set).
- [x] A number typed in «دعوت با شماره موبایل» that belongs to someone in the suggestions list
      shows **their name and photo**; an unknown number still shows the number and a silhouette.

## 2026-09-24 — iOS keyboard (verified on iPhone ✓)

- [x] Login/OTP card stays above the keyboard (`0f0acad`).
- [x] Create-match title field scrolls into view on focus (`5317421`).
- [x] Add-player sheet sits above the keyboard (`b7b35fe`).
- [ ] Other sheets (sort / filter / results player picker) still look normal with the new frame.

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

**⚠ The backend was reset on the afternoon of 2026-09-24 — match `512d9b25` no longer exists.**
Set up a new played 4-player match. (Old note:) match `512d9b25-16b4-4e90-b4bc-e3f33e855c8d` — organizer **سپهر**,
players سپهر · متیوس · پارسا · تست (the `scripts/api.sh` account). Log in as سپهر. On the dev server
the page opens directly at `/matches/512d9b25-16b4-4e90-b4bc-e3f33e855c8d/results` even before the
match ends — which is also how to learn whether the API accepts a result early.
After a submit, the developer can vote as «تست» via `scripts/api.sh` to see the vote shape.

- [ ] Results page shows **one** card (no «+ افزودن بازی», no «بازی ۱» heading).
- [ ] «ثبت نهایی نتایج» is **greyed out** with caption «برای هر تیم دست‌کم یک بازیکن انتخاب کن»
      until each team has a player.
- [ ] Pick teams, enter sets, submit → «در حال ثبت…» → back on the match page.
- [ ] **Capture the result** for the developer: `scripts/api.sh GET /api/v1/matches/{id}/result`
      and paste the output. Its `status` / `myVote` values unblock the voting UI and the
      "result already submitted" state (today the match page keeps offering «نهایی کردن نتیجه»).
- [ ] Submit a second time → note what error text appears (expected: a refusal; we don't know its key yet).
