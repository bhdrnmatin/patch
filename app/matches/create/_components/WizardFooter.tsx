"use client";

import { useEffect, useRef, useState } from "react";
import { appScrollEl } from "@/app/_components/AppScroll";
import BottomBar from "@/app/_components/BottomBar";

interface Props {
  nextLabel: string;
  onNext: () => void;
  nextDisabled?: boolean;
  /** Shows a submitting state on the primary button. */
  pending?: boolean;
  backLabel?: string;
  /** Omitted on the first step — back button hidden. */
  onBack?: () => void;
}

/** Marks the end of the wizard's real content — the page's footer clearance. */
export const WIZARD_END_ID = "wizard-end";

/**
 * True while the footer is still covering something worth seeing.
 *
 * It used to ask "can the scroller still scroll", which is a different question
 * and answered yes at the visual bottom: the page ends with a clearance spacer
 * taller than the bar plus a `gap-4` above it, so ~24px of pure dead space
 * remains scrollable after the last field is fully visible. The 8px tolerance
 * couldn't cover that, and the arrow sat there pointing at nothing.
 *
 * So compare the two rects that actually matter — no tolerance, no magic
 * number, and it can't drift if the bar's padding or the spacer changes: the
 * cue shows only while the end-of-content marker is still below the bar's top
 * edge, i.e. while real content is genuinely hidden behind it.
 */
function useHasMoreBelow(barRef: React.RefObject<HTMLDivElement | null>) {
  const [more, setMore] = useState(false);
  useEffect(() => {
    const sc = appScrollEl();
    const end = document.getElementById(WIZARD_END_ID);
    if (!sc || !end) return;
    const check = () => {
      const bar = barRef.current;
      if (!bar) return;
      setMore(end.getBoundingClientRect().top > bar.getBoundingClientRect().top);
    };
    // Observe the content, not the scroller: the scroller's own box is a fixed
    // 100% and never resizes, but a step's fields change height without firing
    // a scroll or resize event.
    const ro = new ResizeObserver(check); // fires once on observe — covers the initial check
    ro.observe(sc.firstElementChild ?? sc);
    sc.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      sc.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [barRef]);
  return more;
}

/** Fixed bottom action bar: primary next/submit (left) + optional back (right, RTL).
 *  The bar hides whatever it covers, so it carries the "there's more below" cue. */
export default function WizardFooter({
  nextLabel,
  onNext,
  nextDisabled,
  pending,
  backLabel = "قبلی",
  onBack,
}: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const more = useHasMoreBelow(barRef);

  return (
    <BottomBar ref={barRef} className="border border-edge pt-4 flex gap-3">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 -top-12 h-12 flex items-end justify-center bg-gradient-to-t from-surface to-transparent transition-opacity duration-200 ${
          more ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="mb-1 text-muted animate-bounce motion-reduce:animate-none"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || pending}
        aria-busy={pending}
        className="flex-1 min-w-0 h-12 rounded-card bg-primary hover:bg-primary-hover text-white text-sm font-bold disabled:opacity-40 active:opacity-90"
        dir="rtl"
      >
        {pending ? "در حال ثبت..." : nextLabel}
      </button>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 min-w-0 h-12 rounded-card bg-white border border-edge text-ink-soft text-sm font-bold active:opacity-80"
          dir="rtl"
        >
          {backLabel}
        </button>
      )}
    </BottomBar>
  );
}
