"use client";

import { useEffect, useState } from "react";
import { appScrollEl } from "@/app/_components/AppScroll";

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

/** True while the page can still scroll down. The step's fields change height
 *  without a scroll or resize event, so body size is observed too. */
function useHasMoreBelow() {
  const [more, setMore] = useState(false);
  useEffect(() => {
    const sc = appScrollEl();
    if (!sc) return;
    const check = () => setMore(sc.scrollTop + sc.clientHeight < sc.scrollHeight - 8);
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
  }, []);
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
  const more = useHasMoreBelow();

  return (
    <div className="fixed-bar fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border border-edge rounded-t-group px-6 pt-4 pb-[calc(1.5rem+var(--safe-b))] flex gap-3">
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
    </div>
  );
}
