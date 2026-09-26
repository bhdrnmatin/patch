"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const APP_SCROLL_ID = "app-scroll";

/** The element the app scrolls in. Null before hydration. */
export function appScrollEl() {
  return document.getElementById(APP_SCROLL_ID);
}

/**
 * The app scrolls this element, not the document.
 *
 * iOS Safari minimises its toolbar as soon as the *document* scrolls, and keeps
 * the strip it vacated as a live tap target — the first tap there restores the
 * toolbar instead of pressing whatever is under it. That cost the create
 * wizard's بعدی its first tap every time, and it hits every `fixed bottom-0`
 * bar we have. Padding the bars up can't win: the strip is as deep as the
 * toolbar it replaced, so clearing it means giving up that much screen.
 *
 * A document that never scrolls never triggers the minimise, so the toolbar
 * stays put and every tap lands. It also stops the viewport height changing
 * mid-scroll, which is what `dvh` was working around.
 *
 * `position: fixed` still resolves against the viewport in here — `overflow`
 * alone doesn't create a containing block for it — so the fixed headers and
 * bars are unaffected. Anything that used to read `window.scrollY` reads this
 * element instead (`useCollapseHeader`, the wizard footer's scroll cue).
 */
export default function AppScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pullEl = useRef<HTMLDivElement>(null);

  // Next's scroll restoration targets the document, which no longer moves —
  // without this a route change would land you at the previous page's offset.
  useEffect(() => {
    appScrollEl()?.scrollTo({ top: 0 });
  }, [pathname]);

  // The last hole in the zoom lock. `user-scalable=no` (layout.tsx) is honoured
  // by Android and by the installed PWA, but iOS Safari ignores it in a browser
  // tab and lets you pinch anyway — leaving the fixed bars off-screen. These
  // Safari-only gesture events are the only handle on it.
  useEffect(() => {
    const stop = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", stop);
    return () => document.removeEventListener("gesturestart", stop);
  }, []);

  // Track the *visual* viewport, which is the only thing that knows about the
  // keyboard. iOS Safari never shrinks the layout viewport for it, so `dvh`
  // stays full-height and a bottom-pinned card (every AuthCard) sits behind the
  // keyboard. Safari then wants to scroll the focused input into view — but the
  // document can't scroll and this scroller's content is exactly its own height,
  // so with both paths dead it pans the visual viewport instead, dragging the
  // page around in both axes. Sizing the scroller to the visible area gives it a
  // real scroll to perform, and the pan stops.
  //
  // Written on the trailing edge, never per event. Moving focus between the five
  // OTP boxes tears the keyboard down and rebuilds it, and Android reports the
  // full height in that gap — so every keystroke grew `--vvh` for a frame or two
  // and the bottom-pinned card dropped to the floor and came back. Waiting for
  // the events to stop collapses that grow/shrink pair into one write, with the
  // height the viewport actually settled at. 150ms is shorter than the keyboard's
  // own open animation, so the card still rises with it rather than after it.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    let applied = vv.height;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const write = (h: number) => {
      applied = h;
      document.documentElement.style.setProperty("--vvh", `${h}px`);
    };
    const sync = () => {
      clearTimeout(settle);
      const h = vv.height;
      // Shrinking is the keyboard arriving, and it has to land this frame. Hold
      // the frame at full height even briefly and the focused OTP box is behind
      // the keyboard, so the browser scrolls it into view inside this scroller —
      // then the shrink lands, the card no longer needs the scroll, and the
      // offset stays behind with the card pushed off the top.
      if (h < applied) {
        write(h);
        reveal();
        return;
      }
      // Growing, which is the ambiguous one. A focus hop between the five OTP
      // boxes tears the keyboard down and rebuilds it, and Android reports full
      // height in the gap — that is the per-keystroke drop, and it reverses
      // within a frame or two. A real dismissal is still tall 150ms later.
      settle = setTimeout(() => {
        if (vv.height > applied) write(vv.height);
      }, 150);
    };
    // iOS scrolls the *document* to bring a focused input into view, overflow:
    // hidden or not — and it does it against the full-height frame, before the
    // shrink above lands. The frame then fits above the keyboard, but the
    // document stays scrolled by roughly the keyboard's height, so the card sits
    // off the top of the screen until a keystroke makes Safari re-aim at the
    // caret (seen on an iPhone, 2026-09-24). Nothing here ever scrolls the
    // document on purpose, so any offset is Safari's: put it back.
    const unscroll = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    // …which also undoes Safari's only attempt to reveal the field, so do it
    // ourselves, in the scroller: centre the focused field in what's left above
    // the keyboard. The create wizard's title field sat behind the keyboard until
    // the first keystroke without this. Done by hand rather than scrollIntoView,
    // which would scroll the document too and fight `unscroll`. A field already
    // clear of both edges — every auth card — isn't moved.
    const reveal = () => {
      const el = document.activeElement;
      const sc = appScrollEl();
      if (!sc || !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
      // A locked scroller means a sheet is open; it places itself above the
      // keyboard, and scrolling the page behind it would only move the page.
      if (sc.style.overflow === "hidden") return;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        // 96px of margin at the bottom clears the fixed footer bars.
        if (r.top >= 0 && r.bottom <= vv.height - 96) return;
        sc.scrollBy({ top: r.top + r.height / 2 - vv.height / 2 });
      });
    };
    const onFocus = () => reveal();
    write(vv.height);
    vv.addEventListener("resize", sync);
    vv.addEventListener("resize", unscroll);
    vv.addEventListener("scroll", unscroll);
    window.addEventListener("scroll", unscroll);
    // A hop between fields with the keyboard already up fires no resize.
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("focusin", onFocus);
      clearTimeout(settle);
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("resize", unscroll);
      vv.removeEventListener("scroll", unscroll);
      window.removeEventListener("scroll", unscroll);
    };
  }, []);

  // Pull to refresh (user, 2026-09-26). The browser's own can't fire — the
  // document never scrolls, and the installed PWA has none anyway — so it's
  // done here, on the scroller. Only from the very top, never while a sheet
  // has the scroller locked, and not for a sideways swipe (the day strips).
  // The indicator is moved by hand, not through state, like `--collapse`.
  useEffect(() => {
    const sc = appScrollEl();
    const ind = pullEl.current;
    if (!sc || !ind) return;
    const TRIGGER = 70;
    let startX = 0;
    let startY = 0;
    let pull = -1; // -1: not tracking this touch
    const show = (px: number, done = false) => {
      ind.style.transform = `translate3d(-50%, ${px - 48}px, 0) rotate(${px * 3}deg)`;
      ind.style.opacity = px > 0 ? String(Math.min(1, px / TRIGGER)) : "0";
      ind.dataset.ready = String(done || px >= TRIGGER);
    };
    const onStart = (e: TouchEvent) => {
      pull = sc.scrollTop <= 0 && sc.style.overflow !== "hidden" ? 0 : -1;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (pull < 0) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (sc.scrollTop > 0 || (pull === 0 && Math.abs(dx) > Math.abs(dy))) {
        pull = -1;
        show(0);
        return;
      }
      // Half the finger's travel, capped — it should feel like a stretch.
      pull = Math.max(0, Math.min(dy / 2, TRIGGER + 30));
      show(pull);
    };
    const onEnd = () => {
      if (pull >= TRIGGER) {
        show(TRIGGER, true);
        ind.firstElementChild?.classList.add("animate-spin");
        window.location.reload();
      } else show(0);
      pull = -1;
    };
    sc.addEventListener("touchstart", onStart, { passive: true });
    sc.addEventListener("touchmove", onMove, { passive: true });
    sc.addEventListener("touchend", onEnd);
    sc.addEventListener("touchcancel", onEnd);
    return () => {
      sc.removeEventListener("touchstart", onStart);
      sc.removeEventListener("touchmove", onMove);
      sc.removeEventListener("touchend", onEnd);
      sc.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return (
    <div
      id={APP_SCROLL_ID}
      className="h-[var(--vvh,100%)] overflow-y-auto overscroll-y-none"
    >
      {/* Above every fixed header (z-50) and bar. */}
      <div
        ref={pullEl}
        aria-hidden
        className="group fixed left-1/2 top-[var(--hero-gap)] z-[60] size-10 rounded-full bg-white shadow-pop flex items-center justify-center pointer-events-none opacity-0 transition-opacity"
        style={{ transform: "translate3d(-50%, -48px, 0)" }}
      >
        <span className="size-5 rounded-full border-2 border-edge border-t-primary group-data-[ready=true]:border-primary group-data-[ready=true]:border-t-transparent" />
      </div>
      {children}
    </div>
  );
}
