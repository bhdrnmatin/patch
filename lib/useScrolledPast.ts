"use client";

import { useEffect, useState } from "react";

/**
 * True once the window has scrolled past `threshold` px. React bails out when
 * the boolean is unchanged, so this re-renders only on the two crossings —
 * not on every scroll frame.
 */
export function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll(); // restored scroll position on mount / back-navigation
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}
