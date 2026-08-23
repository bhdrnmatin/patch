# Changelog

All notable changes to this design system are documented here.
Dates are in YYYY-MM-DD format. Newest entries first.

---

## Unreleased
*(changes not yet tagged/deployed)*

### 2026-08-23 — fixed bars repaint whole

- [Safari] A bright blue sliver appeared between بعدی and قبلی on step 2 of the create wizard: a
  leftover strip of the *previous* paint. Step 1 has no back button (`onBack` is undefined on step 0),
  so بعدی is full-width with its text centred around x≈295; on step 2 قبلی appears and بعدی halves.
  Safari repainted the button but never invalidated the region the old wide one occupied — which is
  why the stray glyph sat at x≈292 rather than near the faded button's centre at x≈163.
- [Safari] A regression from the scroll-container change: `position: fixed` inside an `overflow`
  scroller is where Safari starts missing these invalidations. **`.fixed-bar { transform: translateZ(0) }`**
  puts the four bars that reflow their own children — `WizardFooter`, `MatchCtaBar`, the profile save
  bar, `BottomNav` — on their own compositing layer, so a reflow repaints the whole thing. Safe on the
  bar itself: a transform only becomes a containing block for its *descendants'* fixed positioning, and
  none of these have any.
- [Verified] On device: the sliver is gone across the step 1 → 2 transition. `tsc --noEmit` clean,
  all seven routes 200.

### 2026-08-23 — the document stops scrolling

- [Safari] Reported as the create wizard's بعدی doing nothing on step 3 — the bottom menu opened
  instead. **iOS Safari minimises its toolbar as soon as the document scrolls, and keeps the strip it
  vacated as a live tap target**: the first tap there restores the toolbar rather than pressing what's
  under it. Confirmed by the second tap working every time. It was never wizard logic — every
  `fixed bottom-0` bar we have was losing its first tap the same way, and `BottomNav` sits in the same
  band.
- [Safari] Padding the bars up out of the strip was tried first and didn't clear it: the strip is as
  deep as the toolbar it replaced (~80px), so buying safety that way costs that much screen on every
  device. **The app now scrolls an inner container (`AppScroll`) instead of the document** — a document
  that never scrolls never triggers the minimise, so the toolbar stays put and every tap lands. Free
  side effect: the viewport height stops changing mid-scroll, which is what `dvh` was working around.
- [Safari] `position: fixed` still resolves against the viewport inside it (`overflow` alone doesn't
  create a containing block), so the fixed heroes and bars needed no change. The three places that read
  window scroll now read the container: `useCollapseHeader`, the wizard footer's "more below" cue, and
  the wizard's scroll-to-top on step change.
- [Safe areas] `viewport-fit=cover` on the root `viewport` export, so `env(safe-area-inset-*)` reports
  real numbers instead of 0 — nothing in the app read them before. `--safe-b` lifts every fixed bottom
  bar and `BottomNav` clear of the home indicator, the five bottom clearances grew to match, and
  `--hero-gap` picked up `env(safe-area-inset-top)` so `cover` doesn't slide the heroes under the
  status bar in the installed PWA. In Safari both insets are 0 and nothing moves; this is for standalone.
- [Verified] On device: بعدی takes the first tap on step 3. `tsc --noEmit` clean; /, /matches,
  /tournaments, /activity, /profile, /matches/create, /profile/edit/personal all 200 with no runtime
  errors.
- [Watch] Two things this pattern makes newly breakable: Next's scroll restoration targets the document
  and no longer fires, so `AppScroll` resets the container on `usePathname()` change; and a
  `ResizeObserver` on the scroller is useless (its box is a fixed 100%) — observe the content instead,
  which is what the wizard's cue does now.

### 2026-08-23 — the page has a background of its own

- [Safari] Reported as the bars flickering black then blue while scrolling, on a phone. The app had
  **no canvas colour**: `body` was `bg-black` while every screen paints its own light content on top,
  so iOS Safari — which tints its toolbars and fills the overscroll gap from the pixels at the scroll
  edge — grabbed black on one screen and the hero blue on the next. `--background` is now `#F5F7FA`,
  the surface every page already uses and the same value as `manifest.json`'s `background_color`, so
  the installed PWA and the Safari tab finally agree. Plus `color-scheme: light` (no dark tinting),
  `overscroll-behavior-y: none` (no document bounce), and a pinned `themeColor` in the root `viewport`
  export so Safari has a fixed colour to fall back on instead of sampling.
- [Headers] That left a second inconsistency, and it was structural rather than a colour: the four
  `SportPageHeader`/`MatchDetailsHeader` pages kept a blue bar because their hero is `fixed top-0` and
  never leaves the top edge, while `/profile`'s hero is in-flow by design (it can't collapse — see
  2026-08-20) and scrolls away to a white one. **`--hero-gap: 12px`** now holds a band of `bg-surface`
  above every hero, so the app's own surface is what touches the top edge on all five — the bar reads
  the same colour on every page and never changes as you scroll. The heroes gained `rounded-group`
  (top corners too, now that they no longer bleed to the edge); the fixed one also gets a fixed
  surface strip filling the band, so cards scrolling under it don't show through.
- [Verified] `tsc --noEmit` clean. Served CSS confirmed carrying `--background: #f5f7fa`,
  `color-scheme: light`, `overscroll-behavior-y: none` and all four `--hero-gap` utilities; served
  HTML carrying `<meta name="theme-color" content="#F5F7FA">`.
- [Note] `useCollapseHeader` needed no change — it derives the scroll range from the
  `--hero-max`/`--hero-min` delta, which a constant offset doesn't touch. The collapse now starts
  12px of scroll late; not corrected.

### 2026-08-21 — the headers draw their own court

- [Headers] The five art headers were built around athlete photography that was never sourced and
  couldn't be licensed. Removing the photos first left a flat `bg-primary` slab — correct and dead,
  a third of the screen carrying a 24px title and nothing else. All five now render **`CourtBackdrop`**:
  a padel court at night in SVG — floodlight bloom, lit surface receding to a vanishing point, the net
  as the one strong horizontal. `#33A3FF` was already padel-court blue, so the brand colour isn't
  decorating the court, it is the court.
- [Headers] **The title became the subject**, which is what actually fixes the dead space: 62px for
  مَچ, stepping to 54 and 44 (`heroTitleSize`, by glyph count, ZWNJ excluded) so فعالیت‌ها still clears
  the left gutter at 360px. `.hero-collapse-title` now interpolates `--title-open` → 19px on a single
  centre track (119px → 36px), instead of the old fixed 24 → 17px.
- [Headers] **The `from-black/*` scrim is gone.** It existed to punch a title out of a photo; the sky
  gradient `#0A4E92 → #3BA9FF` carries white text at ~4.5:1 unaided. (Flat `#33A3FF` did not — 2.68:1,
  under the 3:1 large-text floor, which is why the photo-free intermediate needed a scrim at all.)
- [Headers] Vector solves the three things that killed the photo: it compresses with the collapse
  instead of re-cropping, it has no subject to ghost against a blurred backdrop, and it carries no
  licence. `/matches/[id]` keeps a fixed 32px title with `truncate` — the match name is user data.
- [Headers] The image props are untouched and still restore the old layered path, scrim included, so
  this is reversible per-header by passing a path. The nine files in `public/images` are still there.
- [Verified] Headless Chrome at 390×845 across all five routes: `--collapse` 0 → 1.0000 on
  /tournaments, header 276 → 130px, title 54 → 19px, zero `<img>` in the header. `tsc --noEmit` clean;
  `eslint` 0 errors (23 pre-existing `<img>` warnings, none in the headers any more).

### 2026-08-20 — the profile hero stops collapsing

- [Profile] Reported as the avatar sitting wrong once you scroll, but the avatar was only the visible end of it: **`--collapse` never reaches 1 on `/profile`**. The hook scrolls the collapse over the header's own height delta (`--hero-max` 276 − `--hero-min` 72 = 204px), and this page is ~780px tall, so all it can offer is `780 − viewport` — 60px on a 718px phone, 118px on a 660px one. The value topped out around 0.29–0.58 and parked there, leaving every part of the header frozen in a state only meant to be passed through: the avatar 64px instead of 96, hanging 13px past the header's edge and drifted 66px in from the right, floating over the athlete art and aligned to nothing.
- [Profile] `ProfileHero` is now a plain static 276px header, in flow rather than fixed-plus-spacer, with the avatar always at its open position — 96px at `right-6`, half of it hanging over the bottom edge. A collapsing hero exists to reclaim space for a long list; this page has four rows and nothing to reclaim for. `/matches` and `/tournaments` keep `useCollapseHeader` — their lists finish the travel.
- [Nav] `.hero-collapse-avatar` was profile-only, so it left `globals.css` with it. The remaining `.hero-collapse*` rules belong to `SportPageHeader` and are untouched. The collapse comment and CLAUDE.md now state the precondition that was implicit before: only put a collapsing header on a page that can scroll 204px past the viewport.
- [Verified] Headless Chrome at 393px across four heights (845/718/660/600), scrolled to top and to the bottom of each: avatar 96px, 24px from the right, 48px of overhang — identical in all eight states. The open hero is pixel-unchanged from before.

### 2026-08-20 — portrait only

- [PWA] Added `app/manifest.json` — the app never had one, despite being a PWA. `"orientation": "portrait"` is the real lock: an installed app simply doesn't turn. Also carries name, description, `start_url`, `display: standalone`, the brand `theme_color` `#33A3FF`, and `dir: rtl` / `lang: fa`. No `icons` yet — there's no app icon in `public/`, only nav and stat glyphs, so installability still needs one made.
- [Nav] A manifest binds nothing in a browser tab, where no API can refuse a rotation, so a sideways phone gets a «گوشی را عمودی بگیرید» screen instead of a broken layout: one `.portrait-only` overlay in `layout.tsx` (so it covers every route) shown by `@media (orientation: landscape) and (max-height: 500px)`, with `overflow: hidden` on the body behind it. The `max-height` is what keeps desktop windows — landscape too, but tall — out of it.
- [Verified] Headless Chrome, `/onboarding`: hidden at 390×845, `display: flex` + body `overflow: hidden` at 845×390, hidden again at 1440×900 and back at 390×845. `/manifest.json` serves 200 with `orientation: portrait` and Next injects the `<link rel="manifest">`.

### 2026-08-20 — the wizard drops step ۵, back to five steps

- [Create] **Step ۵ تنظیمات is gone** (user decision: unused for now). It asked نحوه ورود بازیکنان and nothing consumed the answer — `createMatch` writes a `MatchListItem`, which has no such field, and there is no join/approval endpoint — so `StepSettings.tsx`, `JOIN_METHOD_OPTIONS` and `CreateMatchDraft.joinMethod` were removed with it rather than left as a question the app throws away. The wizard is مشخصات · مکان · زمان‌بندی · بازیکنان · اتمام.
- [Create] Two things the removal touched: step ۱ no longer sets `joinMethod: "invite"` when you pick خصوصی (there is nothing to set), and the review banner drops its join sentence — it states visibility alone again, which is the only part still collected. `invite` itself is untouched; it has been asked in step ۱ since 2026-08-12, so `CreateMatchDraft` now files it there instead of under a step ۵ that no longer exists.
- [Verified] Headless Chrome at 390×845: the header counts «مرحله ۱ از ۵», the chip strip is the five remaining labels with تنظیمات gone, and بعدی advances to «مرحله ۲ از ۵». `tsc --noEmit` and `eslint` clean (two pre-existing `<img>` warnings in StepLocation).
- Bringing it back is a git-history job, logged in TODO.md against the join flow that would give the answer a consumer.

### 2026-08-20 — a scroll cue on the create wizard

- [Create] The fixed `WizardFooter` is a white bar flush to the bottom edge, so it reads as the end of the page and silently hides whatever scrolls under it — pick حالت بازی in step ۱ and nothing moves, with نمایش مسابقه and the optional title/description off-screen below. A fading chevron now sits just above the bar whenever the page can still scroll down, and disappears at the bottom.
- [Create] It lives in the footer because that's the one element all six steps share, so the cue is control-agnostic — it covers the radio cards, the بله/خیر court gate, the calendar and the review list alike. Step heights change without a scroll or resize event (choosing بله reveals the court picker), so a `ResizeObserver` on `document.body` re-checks alongside the scroll listener.
- [Verified] Headless Chrome at 390×845: step ۱ is 1085px tall, cue opacity 1 at the top and 0 once scrolled to the bottom; `pointer-events-none` throughout, `motion-reduce:animate-none` on the bounce.

### 2026-08-12 — how players get into a public match

- [Create] Step ۵ تنظیمات asks **نحوه ورود بازیکنان** when step ۱ set the match to **عمومی**: ورود آزاد (anyone joins, no confirmation), فقط با دعوت (only holders of the invite link — the one sent by SMS or shared from the match page), or با تایید شما (a join request the creator accepts or rejects). A `RadioCardGroup`, same idiom as steps ۱ and ۴.
- [Create] This **replaces the تایید خودکار ورود بازیکن toggle**, which was the same question with two of the three answers — `draft.autoApprove: boolean` is now `draft.joinMethod: "open" | "invite" | "approval"`. Step ۵ can't advance until it's answered, as before.
- [Create] **خصوصی doesn't ask.** A private match is only reachable through its link, so joining it is invite-only by definition — step ۱ sets `joinMethod: "invite"` when you pick خصوصی, and step ۵ shows nothing. Switching back to عمومی leaves that as the pre-selected answer, which the creator can change.
- [Create] The review banner now states visibility **and** the join rule («این مَچ در فهرست مَچ‌ها دیده می‌شود. درخواست‌های ورود را شما قبول یا رد می‌کنید.»). Private keeps one sentence — a second saying "link-only" would just repeat it.
- [Create] **Step ۵ is now that field alone.** حداقل سطح, حداکثر سطح, ترجیح جنسیتی and هزینه ورودی were removed (user decision), along with the `ToggleSetting` component and type they were the only users of, and the `minLevel`/`maxLevel`/`gender`/`entryFee` draft fields. Consequence to know about: `createMatch` set the match price from the entry fee, so **every match created in the wizard is now free** (`price: 0`) until a pricing field comes back — the /matches cards and the fee sort still read that field.
- [Create] A **private** match sees a one-line banner instead of an empty step, since its join method was settled in step ۱ and nothing else remains to ask.
- Nothing consumes `joinMethod` yet: `createMatch` stores a `MatchListItem`, which has no such field, and there's no join/approval endpoint. Logged in TODO.md.

### 2026-08-12 — QA audit fixes: one mobile rule, announced errors, CSS-owned collapse geometry

The four actionable items from the 2026-08-08 `ds-qa-tw` audit.

- [Lib] One mobile-number rule: `isValidMobile()` in `lib/persian.ts` normalizes to Latin digits and tests `/^09\d{9}$/`. `/login` (which stores Persian digits) and `AddPlayerSheet` (which stores Latin) had drifted into two regexes for the same rule; both call the shared one now. `lib/persian.test.ts` is the runnable check (`npx tsx lib/persian.test.ts`), covering both notations and the near-misses (10/12 digits, not-09, `+98` form).
- [a11y] `TextField` takes an `error` prop and owns the ARIA: `aria-invalid`, `aria-describedby` pointing at a `role="alert"` message, and a danger border. The invite sheet's phone error used to be a muted `<p>` the field wasn't wired to — visible, but invisible to a screen reader, and indistinguishable from the general hint it replaced. Both now show at once, the hint staying put.
- [Nav] Collapsed filter/sort buttons floor at **44px** — the project's touch minimum. `.hero-collapse-actions` scaled to 0.78 (37.4px); it now scales to 44/48. The audit's companion `DateCell` finding was stale: the date strip stopped being scaled when the RTL-scroller clipping was fixed, so it's 52px at every step.
- [Nav] **All collapse geometry moved into `globals.css`**, next to the rules it's derived from: `--hero-max`/`--hero-min` on `:root`, plus a `.hero-collapse-dates` modifier for the taller collapsed bar the date strip needs. `useCollapseHeader()` now takes no argument — it reads those two properties off the element and derives the scroll range itself, so a caller can no longer state a range that disagrees with the CSS (the failure mode behind both header bugs shipped on 08-07). `SportPageHeader` and `ProfileHero` lost their `HERO_MAX`/`HERO_MIN` constants and their inline style objects; the spacer and the athlete photo read `h-[var(--hero-max)]`.
- [Verified] First browser check of the collapsing header (headless Chrome from the puppeteer cache, 390×845 — `/usr/bin/chromium-browser` is an uninstalled snap stub, which is why this had never run). At `--collapse: 0` and `1`: header 276 → 130px with dates, 276 → 72px bare; the in-flow spacer's bottom edge equals the header's height at both ends, so the content below meets it exactly; collapsed buttons measure 44×44 at x 24 and 75.3, ending exactly where the 56px date strip begins; the profile title sits 20–52px with the 40px avatar beside it. Not yet a phone: momentum scrolling and the iOS URL-bar resize still need a device.

### 2026-08-08 — guarded pages no longer wait on a dead backend

The API stopped answering entirely (it had been returning a fast 502; now every endpoint hangs), which exposed three separate ways the app waits forever on it.

- [API] `apiFetch` requests time out after 10s (`AbortSignal.timeout`) instead of never settling. A hung fetch left the `["me"]` query permanently `isLoading`, so `AuthGuard` held every guarded page on its spinner — most visibly `/matches/create`. Timeouts and network failures surface as «ارتباط با سرور برقرار نشد، اتصال خود را بررسی کنید.» The token-refresh call got the same timeout.
- [Auth] `useRequireAuth` no longer blocks rendering on `/players/me`. Holding a token is enough; the query only decides whether to bounce an incomplete profile to `/profile-setup`. Waiting for it cost a full request timeout **on every mount** while the backend is down, since a failed query refetches. The trade: a genuinely incomplete profile sees the app briefly before the redirect, which only happens right after signup.
- [Auth] The `["me"]` query is `retry: false` (was `retry: 1`) — every guarded route blocks on it, so a retry doubled the stall for no new information. This was already logged in TODO.md as a tidy-up; the hang promoted it.

### 2026-08-08 — invite teammates by phone or link

- [Fix] The Patch-player picker wouldn't open on device. It was a second `BottomSheet`, so switching to it ran one sheet's cleanup (`history.back()`, async) and the other's setup (`pushState`) in the same commit — the same history churn behind the earlier open/shut flash. The player list is now a third **view inside `AddPlayerSheet`**, so exactly one sheet is ever open. `PlayerPickList` was extracted from `PlayerPickerSheet` and is shared by both; `PlayerPickerSheet` keeps its API, so the results page is unchanged. Editing a row also opens on the view it came from — prefilled phone form, player list, or the menu.
- [Create] A phone invite carries a **نام** as well as the number (`Teammate = {kind:"invite", name, phone}`), so the row reads `رضا محمدی (۰۹۱۲۳۴۵۶۷۸۹)` and the team preview and review list show the name instead of a bare number. Both fields are required to submit. Reopening an invited row lands straight in the prefilled form (button reads ذخیره) — the number isn't shown anywhere else, so without that a typo could only be fixed by deleting the row.
- [Create] Step ۴ بازیکنان: tapping a teammate slot now opens **افزودن بازیکن** — pick someone already on Patch, or **invite a phone number** (۱۱ digits, `09…`, entered in Persian digits and stored as Latin). A filled slot can also be emptied from the same sheet. New `AddPlayerSheet` (menu + phone field in one sheet, mounted only while open so it always opens on the menu).
- [Create] A teammate slot is now a union rather than a bare index — `TeammateSlot = {kind:"player", index} | {kind:"invite", phone} | null` (`lib/types.ts`). `TeamPreview` shows an invited number with a دعوت‌شده caption, and the review list gives it a دعوت‌شده role tag with no level/avatar (they haven't accepted yet). `createMatch` keeps invited numbers out of the roster for the same reason.
- [Match] The share card on `/matches/[id]` works now — it was a dead `<button>`. It opens the **native share sheet** (`navigator.share`) with the match URL, covering Telegram, WhatsApp, Instagram and SMS in one tap, and falls back to copying the link (with a لینک کپی شد state) where the Web Share API isn't available. Per-app buttons were rejected deliberately: Instagram has no public URL scheme for sending a link to a DM, so the OS sheet is the only route to it.
- [Fix] `AddPlayerSheet` flashed open and shut on tap. It was the only sheet **mounted** already-open instead of staying mounted and toggling `open` — so its `BottomSheet` effect (which pushes a history entry) ran at mount, where React StrictMode double-invokes it. It now stays mounted like every other sheet and resets its view/phone during render on the closed→open transition.
- [Fix] `BottomSheet` hardening found while chasing the above (both real bugs, neither was the flash): the effect depended on `onClose`, whose identity changes on every parent render, so any re-render while a sheet was open tore down its history entry and re-pushed it — `onClose` now lives in a ref and the deps are `[open]` alone. And a pop now only closes the sheet when it leaves the marker behind, which stops the redundant second `history.back()` after a real back press.
- [Create] Picking **بازیکن** as your own role in step ۴ reveals a **مربی (اختیاری)** field: the برگزار کننده role is open, so it can be handed to one of the teammates you added (`SelectField` + `OptionSheet`, both reused). Picking the current coach again clears it. Choosing **برگزار کننده (مربی)** for yourself forces it back to none, and the review list tags whoever holds it as برگزار کننده instead of یار/دعوت‌شده. The coach is stored as a row index, so removing a teammate shifts it to keep pointing at the same person — and removing the coach clears it.
- [Create] The حالت بازی choice in step ۱ now sets the roster limit in step ۴: **رقابتی** is 2v2 padel, so it caps at ۳ teammates (۴ with the creator) and the add button disappears at the limit; **دوستانه** and **آمریکانو** have no cap and rows keep growing (بازیکن ۵, ۶, …). Switching an over-limit roster to رقابتی trims it to the first three, since step ۴ can't show the rest. `teammates` is a plain `Teammate[]` now rather than a fixed three-slot tuple (`lib/types.ts`), and the 2×2 `TeamPreview` only renders for رقابتی — آمریکانو rotates partners and دوستانه has no fixed team shape, so a court grid would be lying. `createMatch` reports capacity ۴ for رقابتی and the actual roster size otherwise.
- [Create] Step ۴ no longer shows three permanent empty player fields alongside the dashed add button — two controls for one job. Only added teammates get a row; the dashed button is the single way in, and it disappears at three. Removing a teammate closes the gap so the rows stay contiguous (the sheet's action is now حذف این بازیکن rather than خالی کردن این جایگاه). The 2×2 `TeamPreview` still shows the empty court positions.
- [Create] Step ۴ notes that empty slots can be filled later from the match's invite link — the link is the match URL, so it can't exist before the match does. See TODO.md.

### 2026-08-07 — gateway errors read as downtime

- [API] A 502/503/504 now surfaces as «سرور در دسترس نیست، لطفاً کمی بعد دوباره تلاش کنید.» instead of «خطای سرور (۵۰۲)». Those statuses come from the proxy, not the API, so the body is an nginx HTML page with no `errorMessage` to show — the old generic fallback made downtime look like a bug in the app. A real API message still wins when one is present (the check sits after the payload fields). The remaining generic fallback now renders its status in Persian digits (`fix/gateway-error-message`).

### 2026-08-07 — collapsing header on scroll

- [Nav] The `/matches`, `/activity` and `/tournaments` hero now **collapses as you scroll** — the title, filter/sort buttons, date strip and athlete photo all shrink together, 276px → 120px (72px where there's no date strip) — the title and buttons ride up with the header, so the open layout's 56px status-bar gap doesn't survive the collapse as dead space. One `--collapse` value (0 → 1) written onto the header by `useCollapseHeader` (`lib/`) drives every part through `calc()` in `app/globals.css`; the hook writes straight to the DOM on a rAF, so scrolling doesn't re-render React. The header is `fixed` with a same-height spacer in flow, and the collapse range equals the height delta — so the page never reflows, the scroll position can't jump, and the content below meets the header's bottom edge exactly instead of sliding under it (`feat/collapsing-header`).
- [Profile] `/profile` collapses the same way, and **the avatar moved into the hero** so it collapses with it: 96px straddling the header's bottom edge when open (exactly the overlap `ProfileIdentity` used to make with `-mt-12`), shrinking to ~40px tucked beside the title when collapsed. `ProfileIdentity` now starts with the name and carries the top padding that clears the hanging avatar. The header art moved into an inner clipped layer so the avatar can hang outside the rounded corners.
- [Cleanup] Dropped `CompactHeaderBar` + `useScrolledPast` — the first swap-in-a-second-bar attempt, orphaned by the real collapse.

### 2026-08-07 — role toggle + audit cleanup

- [Create] Step ۴ بازیکنان: نقش شما moved from a `SelectField` + `OptionSheet` to an inline two-button toggle pair (`aria-pressed`, same chip idiom as the schedule step's quick-day/duration rows) — one tap instead of three. Role copy changed کاپیتان/یار → **برگزار کننده (مربی)** / **بازیکن** across the step, the team preview, and the review list (`feat/role-toggle-copy`).
- [a11y] StepSchedule calendar: each day button now announces its full date (`aria-label="۱۴ مرداد ۱۴۰۵"`) and today carries `aria-current="date"`; past days style through the `disabled:` modifier instead of a JS ternary (`fix/stepschedule-a11y`).
- [a11y] `RadioCardGroup` labels its group with `aria-labelledby`/`aria-describedby` pointing at the visible header and subtitle, instead of duplicating the header text in an `aria-label` (`fix/radiocardgroup-labelling`).
- [Docs] Both audits closed to **0 open** — arrow-key calendar nav accepted (project precedent: `role="grid"` was deliberately removed from AvailabilityHeatmap), render-cost memo accepted (31 items; the finding's SSR-mismatch rationale doesn't hold — a `useState` seed evaluates separately on server and client), `className` passthrough accepted (feature composite, not a shared primitive). CHANGELOG/STATUS caught up on the 08-02 → 08-05 sessions.

### 2026-08-05 — jalali timing step, step-1 radio cards

- [Create] Step ۳ زمان‌بندی fully reworked: quick-day chips (امروز/فردا/پس‌فردا) + a **jalali month calendar** + a 30-min start-time strip (۰۶:۰۰–۲۳:۳۰) + duration chips (۶۰/۹۰/۱۲۰ دقیقه). All three fields are required to advance. New dependency-free `lib/jalali.ts` (inline jalali↔gregorian conversion) with a self-check `lib/jalali.test.ts`. The draft model moved from `monthId`/`dayId`/`daypart` to `date`/`time`/`duration`; `AvailabilityHeatmap`, `wizardMonths`, and `courtAvailability` were removed (`feat/jalali-timing-step`).
- [Create] Step ۱ مشخصات: حالت بازی and نمایش مسابقه render as **radio cards** (icon + title + description + indicator) via the new `RadioCardGroup`, replacing the plain selects (`feat/step1-radio-cards`).
- [a11y] `RadioCardGroup` uses `aria-pressed` toggle buttons + a generic `role="group"` rather than `role="radiogroup"`/`role="radio"` — the radio roles promised arrow-key roving focus that wasn't implemented; the toggle form matches the app's chip precedent.

### 2026-08-04 — مکان rework, optional fields, Web OTP

- [Create] Step ۲ مکان reworked for the single-city launch: استان/شهر are locked to البرز/کرج (disabled `SelectField`s), and the step now gates on **رزرو زمین** — بله opens a searchable court picker with the court's location, a static map, and a مسیریابی button; خیر shows an `InfoBanner` and blocks advancing. The old "انتخاب روی نقشه" custom-court button was removed (`feat/invite-to-step1`).
- [Create] Invite mode (public/private) moved from step ۵ to step ۱ as a `SelectField`; the match title is now optional (labeled اختیاری) and the description field is labeled توضیحات (اختیاری) (`feat/optional-match-title`, `feat/optional-description-label`).
- [Create] Wizard step nav fixed — the step chips now jump both back to any completed step and forward to any step already reached (`feat/invite-to-step1`).
- [Cleanup] `/simplify` pass over the wizard: dropped the dead `CourtOption.name` field and tidied a redundant `StepChips` guard (`chore/wizard-simplify`).
- [Auth] OTP wires the **Web OTP API** for Android SMS autofill (`navigator.credentials.get({ otp })`, aborted on unmount) on top of the `autocomplete="one-time-code"` fallback. Backend still needs the SMS last line `@<web-origin> #<code>` with Latin digits (`chore/otp-weboptp-and-devorigin`).
- [Dev] Added LAN origins `10.59.1.155` / `172.20.10.2` to `allowedDevOrigins` for on-device testing.

### 2026-08-03 — profile edit, preferred side, OTP resend

- [Profile] `username` is out, **ساید ترجیحی** (`preferredSide: RIGHT | LEFT`) is in — the backend is dropping username. Profile-setup submits the profile then posts `preferredSide` to `/players/me/display-info`; `/profile` shows a live راست/چپ chip (court icon) next to gender and city instead of the `@username` line. Types updated: `username` off `UpdateProfileRequest`, `preferredSide` onto `UpdateDisplayInfoRequest` + `PlayerResponse`, `bio` now optional (`feat/profile-preferred-side`).
- [Profile] `/profile/edit/personal` now edits first/last name (Persian-only), preferred side, residence (province→city cascade) and bio; save PUTs the profile then posts display-info and invalidates `["me"]`. Design pass on top: the avatar itself is the tap target with a camera badge, fields are grouped under labeled section headers (مشخصات / محل سکونت / بیوگرافی) in the app's icon-circle idiom, and the primary action is a sticky bottom save bar with the status caption (`feat/edit-personal-info`, `design/profile-edit-polish`).
- [Sheets] `OptionSheet` gained an opt-in `searchable` prop (top search filtering by label + empty state); `BottomSheet` gained `fill` (fixed full height) so searchable sheets stay top-anchored and the mobile keyboard overlays the bottom of a scrollable list instead of hiding a short one. Existing create-wizard usages unchanged.
- [Auth] OTP: the countdown is relabeled as a **resend cooldown** (it always was one), with a resend button at zero that re-requests the code and restarts from the new `nextResendAllowedAt`. `OtpInput` accepts SMS autofill (`autocomplete="one-time-code"` + multi-digit paste spread; dropped `maxLength=1`) (`feat/otp-resend-autofill`).
- [a11y] `AuthSearchSelect` returns focus to its trigger on close (`fix/searchselect-focus-return`). The 2026-07-22 audit's two open Warnings were re-verified as already fixed in that session's v2 refactor.

### 2026-08-02 — profile menu, nav icon

- [Profile] Both edit entry points go straight to `/profile/edit/personal`; the intermediate `/profile/edit` list page is deleted. Removed the public/private photo-visibility toggle along with the orphaned `updatePhotoVisibility` fn and `PhotoVisibility` type (`chore/profile-edit-cleanup`).
- [Profile] Logout moved out of settings onto the profile page as the last row (icon-pill matching the nav rows, red glyph + chevron); the تنظیمات nav row is commented out until settings flows exist (`feat/profile-logout-row`).
- [Nav] Second tab icon reverted to the trophy `CupIcon` (label باشگاه‌ها + coming-soon behavior unchanged) (`feat/clubs-tab-cup-icon`).
- [Auth] Default post-auth route points at the matches list.

### 2026-07-29 — empty states, nav polish, copy pass

- [Copy] App-wide copy update. New onboarding slide texts (+ بزن بریم CTA), login button → ادامه, OTP title تایید شماره / button تایید, profile-setup welcome copy, assessment Q1/Q2 wording. Global term change **مسابقه → مَچ** (مسابقات/مسابقه‌ها → مَچ‌ها, مسابقه‌ای → مَچی) across ~15 files — nav, matches, create wizard, profile, and mock text (`chore/copy-update-mach`).
- [Matches] Empty state when no matches exist: `EmptyMatches` (icon + message + a ساخت مَچ CTA to `/matches/create`), distinct from the filtered-out message and guarded on `!isLoading`. Emptied the mock `matchList` so a fresh start shows it; removed the orphaned `squad`/`AVATAR` mock helpers (`feat/matches-empty-state`).
- [Activity] Empty state when there are no activity sections: `EmptyActivity` (Discover icon + message, no CTA). Emptied mock `activitySections`; removed the orphaned `COURT_THUMB` (`feat/activity-empty-state`).
- [Nav] Red notification dots are now data-driven — a new `getUnreadCounts()` accessor (`lib/data` seam, `{}` until a notifications backend exists) replaces the hardcoded `badge:true` flags. A tab shows its dot only when its route has unread items — none today (`feat/nav-notification-dots`).
- [Nav] Tapping the disabled clubs tab flashes a transient به زودی bubble above it (auto-hides after 1.8s, keyed by href); dropped the pill's `overflow-hidden` so the bubble can sit above the bar (`feat/clubs-tab-hint`).
- [Auth] Post-auth landing moved to the create-match wizard — `POST_AUTH_ROUTE` = `/matches/create` (`chore/post-auth-to-create`).
- [Cleanup] Removed the unused `ProfilePhotoVisibilityRequest` type (flagged by ponytail-audit of the logic layer, which otherwise came back lean) (`chore/rm-dead-type`).

### 2026-07-28 — auth routing, OTP countdown, bottom-nav

- [Auth] Protected routes now require a **complete profile**. `useRequireAuth` (in `AuthGuard`) fetches `/players/me` and redirects to `/profile-setup` when `profileStatus !== "complete"`; a complete profile passes through, and an errored/unreachable `/me` lets the user through rather than trapping them on a spinner. OTP-verify routes by the same field, and profile-setup seeds the `["me"]` cache with the returned player on success so the guard doesn't bounce the user straight back. Shared `/me` query options and the completeness check are centralized as `meQuery` / `isProfileComplete` in `lib/api/useAuth.ts` (`feat/profile-status-guard`).
- [Auth] Post-auth landing moved from `/` (empty for now) to `/matches`, via a single `POST_AUTH_ROUTE` constant in `lib/routes.ts` — used by OTP-verify, profile-setup, assessment-finish, and the already-authed guard so the destination lives in one place (`feat/post-auth-route`).
- [Auth] OTP page shows a live **code-validity countdown** (`mm:ss`, Persian digits): login forwards `nextResendAllowedAt` from `/otp/request` to `/otp` as an `expires` param, which counts down to it and shows "اعتبار کد به پایان رسید" at zero (`feat/otp-countdown`).
- [Auth] After profile-setup, redirect no longer goes to `/assessment` (deferred) — routes to the app instead; assessment page/route left intact with a TODO to restore (`chore/skip-assessment-redirect`).
- [Nav] Add-menu reordered to ساخت مسابقه · رزرو زمین · ساخت تورنومنت; only create-match is live, the other two render as non-navigating "به زودی" rows (`aria-disabled`, dimmed — the `NavRow` pattern) (`feat/add-menu-order-comingsoon`).
- [Nav] Second bottom-nav tab is now باشگاه‌ها (`/clubs`) with a new `ClubsIcon`, rendered disabled/non-navigating ("به زودی", icon at 40% opacity, `aria-label` notes it). Tournaments dropped from the nav; the now-unused `CupIcon` removed (`feat/nav-clubs-tab`).

- [Fix] API/auth review (`/code-review` over the API layer) — fixes applied:
  - [Auth] A 401 now only ends the session when the access token is genuinely gone/expired; a 401 while holding a valid token (authorization, transient, or a just-refreshed token not yet propagated) surfaces as a normal error instead of logging the user out (`lib/api/client.ts`)
  - [Auth] OTP verify handles a `getMe` failure — falls back to `/profile-setup` instead of stranding the user on the OTP screen (e.g. a brand-new profile 404)
  - [Types] `updatePhotoVisibility` is typed `PhotoVisibility` (`"PUBLIC" | "PRIVATE"`, shared from `types.ts`); corrected the stale `updateProfile` JSDoc

- [Auth] Token refresh rotation (`POST /auth/refresh`, `{refreshToken}` → `{accessToken, refreshToken}`) wired in `lib/api/client.ts`: a known-expired access token is refreshed before the request, a 401 triggers one refresh + replay, concurrent 401s share a single in-flight refresh, and the rotated refresh token is stored. Only a dead refresh token clears the session and redirects to /login. Resolves the 15-min access-token logout.

- [Profile] Profile-setup now sends all API-required fields (`firstName/lastName/gender/residenceCityId/username`) and adds location:
  - [Location] New `lib/api/geo.ts` (`getProvinces`/`getCities`); province→city dependent selection sent as `residenceCityId`. Province/city are a **full-screen searchable picker** (`AuthSearchSelect`, rendered in a portal with a top-pinned search field so the mobile keyboard doesn't resize it). Gender uses the inline dropdown (`AuthSelect`); both share one styled trigger.
  - [Username] New username field (`^[a-zA-Z0-9_]{3,20}$` — Latin-sanitized, 3–20). Names capped at 20 (`maxLength`), Persian-only, min 1; invalid input disables submit with an inline message and names are re-filtered on send.
  - [Profile] `/profile` shows the live `@username` (was hidden). `PlayerResponse`/`UpdateProfileRequest` types updated (+ `residenceCityId`, `username`; + `Province`/`City`).
- [Profile] Public/private profile-photo toggle on `/profile/edit/personal` (`PUT /players/me/profile-photo/visibility`); the API doesn't return current visibility yet, so it defaults to public.
- [Mobile] `AuthInput` also filters on `compositionend` and resets the DOM imperatively so Persian-only sticks through Android/Gboard predictive text. `allowedDevOrigins` gained the phone's LAN IP (`192.168.1.44`) — without it Next blocked dev JS on the phone, which had been breaking mobile input/dropdowns.

- [Profile] Profile-editing pass wired to the live API (branch `feat/profile-gender-select`, merged to `main`):
  - [Profile-setup] Gender is now a dropdown (`AuthSelect`) with آقا/خانم storing the backend enum `MALE`/`FEMALE` directly. Name/lastname/city inputs are Persian-only (a shared `toPersianOnly` in `lib/persian.ts` strips Latin letters/digits, keeps ZWNJ/spaces)
  - [Edit profile] New `/profile/edit/personal` page (the اطلاعات فردی row now works): profile-photo upload (`POST /players/me/profile-photo`, multipart) + bio editor (`PUT /players/me/display-info`), both invalidating the shared `["me"]` query; bio is Persian-only. Email + change-password rows commented out (flows don't exist yet)
  - [Profile] `/profile` shows the live avatar and bio (`ProfileAvatarLive` island + bio in `ProfileIdentity`); `@username` line hidden. Default avatar is now a Facebook-style silhouette (`avatar-placeholder.svg`), used when no photo is set **or** a photo URL fails to load (`onError`)
  - [Settings] Replaced the delete-account row with a **خروج از حساب** logout row (`LogoutRow` → `POST /auth/logout`, clears session, redirects to /login; resilient to a failed server call); commented out انتخاب زبان and حریم شخصی
  - [Statistics] مشاهده آمار deactivated with a "به زودی" label (`NavRow` `comingSoon`); route/page kept
  - [Auth] Hardened against spurious logouts — a 401 only ends the session when the token is genuinely missing/expired (`isAccessTokenExpired` decodes the JWT `exp`), not on transient backend 401s; the `["me"]` query no longer refetches on tab refocus. **Known backend blocker:** access-token TTL is only **15 min** and there's no `/auth/refresh`, so users still get logged out ~15 min in — needs a backend TTL bump or a refresh endpoint (see TODO)
  - [DX] `dev` script pinned to `-p 3000` so the dev server can't silently bounce to :3001 (which changed the origin and wiped the per-origin localStorage token)

- [API] Connected the auth + profile flows to the live backend (`api.patchapp.ir`), on branch `feat/api-auth-profile`. The API is early — only auth (OTP) and player profile exist, so every other feature stays on the mock `lib/data` seam:
  - [Infra] New `lib/api/` module — `session` (localStorage bearer tokens, SSR-guarded, reactive), `client` (`apiFetch` with typed `ApiError` reading the API's `errorMessage` envelope, 401 → clear session + redirect, 204 handling), `auth`/`players` endpoint modules, and a `useAuth` hook with `useRequireAuth`/`useRedirectIfAuthed` guards + an `AuthGuard` wrapper
  - [Infra] The API sends no CORS headers, so `next.config.ts` rewrites same-origin `/api/v1/*` to the upstream host (server-only `API_BASE_URL`); `.env.example` documents it. Added `toLatinDigits` to normalize Persian phone/OTP input
  - [Auth] Login requests an OTP; the OTP page verifies → stores tokens → routes by profile completeness; profile-setup `PUT`s name+gender (city + the assessment stay local/deferred — no fields yet); the profile page shows the live name via a client island. Protected routes ((main), /profile, /matches/*) redirect to /login; login/otp redirect home when already authed
  - [Auth] OTP length hoisted to an `OTP_LENGTH` constant in `OtpInput` (5 digits; was a hardcoded magic number)
  - [Status] tsc + lint clean, all routes 200, the same-origin proxy is verified forwarding to the upstream. The live OTP happy path is **blocked on a backend bug** — `POST /otp/request` 500s for every number (SMS send throws); all other endpoints behave correctly (verify 410s an expired code, profile endpoints enforce 401, logout 204)

- [Repo] Merged `design/polish-pass` into `main` (`--no-ff`, `7f56c21`); reconciled with the `patchapp` remote (Gitea) by pulling its 18 deploy/infra commits — `.gitea/workflows/deploy.yml`, `Dockerfile`, `docker-compose.yml` (removed) — into `main` via a clean, disjoint merge. `main` pushed to both `patchapp` and `origin` (GitHub); the push to `patchapp/main` triggers the Gitea deploy workflow. Merged branches (`design/polish-pass`, three `feat/*`) deleted — `main` is now the only branch.

- [Design polish] Consistency pass on `design/polish-pass` (audit + plan in `_designer/polish-pass.md`; the color-discipline and imagery-duotone phases were built, reviewed, and rejected by the user — solid-blue usage and original imagery restored):
  - [Motion] Bottom sheets and the AddMenu now animate in (slide-up panel + fading backdrop, `prefers-reduced-motion` respected); all buttons/links ease their pressed states; keyboard focus shows a visible primary outline
  - [Tokens] New: `success`/`success-soft`/`success-deep` + `danger` status colors (StatusBadge, JoinRequestRow, BottomNav dot), `rounded-sheet` 40px, `shadow-sheet`, `drop-shadow-hero`, `text-tiny` 10px. Swept the last hardcoded hexes (`#445A74` ×13 etc.), 6 one-off shadows, 14 arbitrary radii, and one-off text sizes to token classes
  - [Typography] `font-medium`/`font-semibold` removed app-wide — Yekan Bakh only ships 400/700, so those classes rendered synthesized fakes; hierarchy now uses honest `font-bold`/regular

- [Matches] Sort/Filter sheets now actually work on `/matches` — filter by وضعیت and رده‌بندی, sort by هزینه ورودی (least/most), with an empty-state message; sheets became controlled components (`MatchSort`/`MatchFilter`), and the tournaments/activity pages hold their own sheet state (facets without backing data select but don't narrow yet)
- [Mock] The three list matches now have distinct titles, statuses, levels, and prices (were identical clones — filtering was undemonstrable)
- [Create Match] New 6-step wizard at `/matches/create` (مشخصات → مکان → زمان‌بندی → بازیکنان → تنظیمات → اتمام), designed from wireframes with the site design system: step chips + progress ring, per-step validation gating, court search grid or custom address + map, court-availability heatmap (7 days × 4 dayparts, tap to pick the slot), teammate picking with team preview, بله/خیر settings toggles, and a review step composed from the existing match-details cards; "تایید و ثبت" creates the match (mock mutation) and lands on its details page as creator
- [Create Match] 16 new components in `app/matches/create/_components/`, including the app's first light-theme form primitives (`TextField`, `TextArea`, `SelectField`, `OptionSheet`, `ToggleSetting`); new wizard types/mocks/accessors + `createMatch` in the data layer
- [BottomNav] AddMenu's "ساخت مسابقه" now opens `/matches/create` (was the matches list)
- [ScheduleCard] `deadline` prop now optional — the مهلت یارگیری row hides when absent
- [DateCell/DateSelector] New `tone="light"` variant for bg-surface pages (selected day renders solid primary); default glass rendering unchanged

- [Results] New `/matches/[id]/results` page — the creator of a live match registers game results: any number of 2v2 games, each with player slots (picker sheet disables already-placed players; tapping the current player clears the slot) and any number of sets scored via −/+ steppers; the live-creator CTA "وارد کردن نتیجه" now navigates here (breaking: the placeholder `ResultSheet` was removed)
- [Results] 4 new components in `app/matches/[id]/results/_components/`: `GameCard`, `PlayerSlotButton`, `ScoreStepper`, `PlayerPickerSheet`; QA pass applied — `aria-live` score announcements, contextual aria-labels on repeated slots/set buttons, `aria-pressed` on picker rows
- [Mock] `matchDetails.players` are now 6 distinct players (were identical clones — picker was untestable)
- [Tokens] 24px radius consolidated: every `rounded-3xl` / `rounded-t-3xl` / `rounded-b-3xl` app-wide → `rounded-group` variants (SectionCard, FaqSection, ScheduleCard, CourtCard, StoryCard, MatchCtaBar, MatchDetailsHeader); rule documented in CLAUDE.md — no visual change

- [Tokens] Added neutral-scale tokens to `@theme`: `ink` #00254D, `ink-soft` #253343, `muted` #6783A0, `surface` #F5F7FA, `divider` #E5EAF0, `edge` #D0DDEC — all hardcoded gray hexes across Matches/profile/nav components replaced with token classes (no visual change)
- [Tokens] StatusBadge green pair, sheet radii, and shadows reviewed and accepted as one-offs (see TODO.md)
- [BottomNav] Plus button now opens the AddMenu speed dial (Figma 20211:6526): blurred dim backdrop, three glass action rows — ساخت تورنومنت / ساخت مسابقه / رزرو زمین — closing on backdrop tap, Escape, or selection; new `WhistleIcon` / `CourtIcon` inline icons (breaking: plus no longer links to /courts)
- [Patterns] AddMenu spec, HTML prototype, and audit in `patterns/`
- [Match Details] New `/matches/[id]` page from 6 Figma frames — creator/player × not-started/started/finished (demo via `?role=&status=`): hero header, stage dial, info grid, schedule, description, players grid, promo, court card with map, share card, FAQ accordion, join requests (creator), sticky CTA bar
- [Match Details] 20 new components in `app/matches/[id]/_components/`; `MatchDetails`/`JoinRequest`/`FaqEntry` types + mock; hero/promo/map images in `public/images/`
- [BottomNav] `MatchesIcon`/`WhistleIcon`/`CourtIcon` now exported for reuse
- [Layout] Page background is `bg-surface` (#F5F7FA) per Figma — `(main)` layout, profile, profile sub-pages, match details; cards keep Figma shadows (white-on-surface gives the contrast)
- [Tokens] Elevation tokens `shadow-card` / `shadow-pop` added; 14 arbitrary shadow values swept (match details, MatchCard, profile NavRow)
- [Tokens] `text-display` (32px/56px) added for display headings (CourtCard club name)
- [Tokens] Gray-ramp mapping blessed: Figma Gray/50–800 render via `surface`/`muted`/`ink-soft` (rule documented in CLAUDE.md); FaqItem chevron `#30445B` → `ink-soft`

---

## 2026-06-10

### Added
- Matches flow: `/matches` page with hero header, date selector, match cards, and Sort/Filter bottom sheets
- 15 Matches components in `app/(main)/matches/_components/`: `icons`, `IconButton`, `DateCell`, `StatusBadge`, `PlayerSlot`, `MetaItem`, `PriceTag`, `SelectChip`, `DateSelector`, `MatchCard`, `MatchesHeader`, `FilterSection`, `BottomSheet`, `SortSheet`, `FilterSheet`
- `MatchListItem` / `MatchStatus` types in `lib/types.ts`; mock matches and dates in `lib/mock`
- [Tokens] Yekan Bakh font as local OTFs (weights 400/700) via `next/font/local`

### Changed
- [Tokens] App font switched from Vazirmatn (Google Fonts) to Yekan Bakh — CSS variable renamed `--font-vazirmatn` → `--font-yekan-bakh`; replace any `var(--font-vazirmatn)` usage (breaking)
- All pages constrained to a centered `max-w-[430px]` column with black body backdrop, so the mobile frame is visible on desktop viewports
- [BottomNav] Centered to the 430px frame; hidden behind open sheets (sheets sit at `z-[60]`)

### Fixed
- [BottomSheet] Dialog accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape-to-close, body scroll lock (QA pass)
- [FilterSection] Added `role="group"` + `aria-label` (QA pass)
- [MatchCard / SelectChip] Arbitrary radii replaced with token classes (`rounded-card`, `rounded-full`)

---

## 2026-06-08

### Added
- `npm run optimize-images` script

### Changed
- [ProfileHero] Two-layer image and repositioned title/edit button to match Figma
- [BottomNav] Rebuilt as floating glassmorphic tabbar per Figma
- [ProfileMeta] Reordered to level/city/side; colon moved into label
- Profile typography aligned with Figma
- All auth/onboarding/profile images and icons localized from Figma CDN into `public/`; backgrounds optimized to WebP ≤1280px (~30MB → 1.4MB)

---

## 2026-06-07

### Added
- Profile section: `ProfileHero`, `ProfileAvatar`, `ProfileMeta`, `StatsGrid`, `StatCard`, `NavRow`, `PageHeader`, `SubPageLayout`, main `/profile` page and 5 sub-pages (edit, statistics, settings, support, rules)

---

## 2026-06-03

### Added
- Sign-up/login flow: `/login`, `/otp`, `/profile-setup`, `/assessment` pages
- Auth components: `AuthInput`, `OtpBox`, `OtpInput`, `RadioOption`, `RadioGroup`, `AuthActions`, `AuthCard`, `AuthSlide`
- [Tokens] Design token system in `app/globals.css` `@theme` (Tailwind v4) — colors, radii, blurs, font sizes; all auth/onboarding components refactored to token classes

### Changed
- [Button] Renamed from `OnboardingButton` and moved to shared `app/(auth)/_components/` (breaking)
- Auth pages made fluid: `w-full min-h-dvh` frames, responsive card width

### Fixed
- QA pass across auth components: all critical issues
- [RadioOption] Single dividers, correct selected state, circle on right
- Profile-setup labels: correct names, shown above input, Figma typography
- Blank pages; onboarding actions moved inside `StoryCard`

---

## 2026-06-02 — Initial build

### Added
- Onboarding flow (4 RTL Persian story slides): `ProgressBar`, `StoryCard`, `OnboardingActions`, `StorySlide`
- App scaffold: route groups `(auth)` / `(main)`, `BottomNav`, placeholder pages
- PWA mobile-first rules (390px viewport, 44px touch targets) in project conventions
