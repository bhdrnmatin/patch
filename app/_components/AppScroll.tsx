"use client";

import { useEffect } from "react";
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

  return (
    <div
      id={APP_SCROLL_ID}
      className="h-[var(--vvh,100%)] overflow-y-auto overscroll-y-none"
    >
      {children}
    </div>
  );
}
