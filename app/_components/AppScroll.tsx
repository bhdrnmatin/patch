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
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const sync = () =>
      document.documentElement.style.setProperty("--vvh", `${vv.height}px`);
    sync();
    vv.addEventListener("resize", sync);
    return () => vv.removeEventListener("resize", sync);
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
