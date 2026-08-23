"use client";

import { useEffect, useRef } from "react";
import { appScrollEl } from "@/app/_components/AppScroll";

/**
 * Drives a collapsing hero header. Writes a `--collapse` custom property
 * (0 = fully open, 1 = fully collapsed) onto the returned element as the app
 * scrolls; the header's CSS interpolates every part off it. The scroll comes
 * from `AppScroll`, not the window — see that file for why the document
 * doesn't scroll.
 *
 * Deliberately not React state — this changes on every scroll frame, so it goes
 * straight to the DOM (rAF-coalesced) instead of re-rendering the page.
 *
 * The scroll range is the header's own height delta, read off its
 * `--hero-max`/`--hero-min` custom properties: the header then shrinks at
 * exactly the speed the page scrolls, so the content below always meets its
 * bottom edge instead of sliding under it or lagging behind. The caller can't
 * get that wrong because it never states the range — it just carries
 * `.hero-collapse` (plus `.hero-collapse-dates` for the taller collapsed bar),
 * and both values live with the rules they size in globals.css.
 */
export function useCollapseHeader<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    const sc = appScrollEl();
    if (!el || !sc) return;

    const css = getComputedStyle(el);
    const range =
      parseFloat(css.getPropertyValue("--hero-max")) - parseFloat(css.getPropertyValue("--hero-min"));
    if (!(range > 0)) return; // no .hero-collapse class on the element

    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, sc.scrollTop / range));
      el.style.setProperty("--collapse", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update(); // restored scroll position on mount / back-navigation
    sc.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      sc.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
