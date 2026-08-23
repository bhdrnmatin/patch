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

  return (
    <div id={APP_SCROLL_ID} className="h-full overflow-y-auto overscroll-y-none">
      {children}
    </div>
  );
}
