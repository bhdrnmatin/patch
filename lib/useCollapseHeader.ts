"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a collapsing hero header. Writes a `--collapse` custom property
 * (0 = fully open, 1 = fully collapsed) onto the returned element as the window
 * scrolls; the header's CSS interpolates every part off it.
 *
 * Deliberately not React state — this changes on every scroll frame, so it goes
 * straight to the DOM (rAF-coalesced) instead of re-rendering the page.
 *
 * `range` must equal the header's height delta: the header then shrinks at
 * exactly the speed the page scrolls, so the content below always meets its
 * bottom edge instead of sliding under it or lagging behind.
 */
export function useCollapseHeader<T extends HTMLElement>(range: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / range));
      el.style.setProperty("--collapse", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update(); // restored scroll position on mount / back-navigation
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [range]);

  return ref;
}
