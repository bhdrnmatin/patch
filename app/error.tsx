"use client";

import { useEffect } from "react";

/**
 * Whole-app error boundary. Data accessors in `lib/data/` are read through
 * `useSuspenseQuery`, which *throws* when a fetch fails — without this, a
 * backend outage takes the page to Next's default crash screen. The API is
 * still being built and goes down regularly, so this is the normal path, not
 * an exotic one.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Nothing collects client errors yet; the console is what a device debug
    // session can actually read.
    // ponytail: swap for a reporter when one exists.
  }, []);

  return (
    <main className="w-full min-h-dvh bg-surface flex flex-col items-center justify-center gap-6 px-7">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-title font-bold text-ink" dir="rtl">
          ارتباط برقرار نشد
        </h1>
        <p className="text-sm text-muted leading-6" dir="rtl">
          اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="h-12 px-8 rounded-pill bg-primary text-white text-sm font-bold active:bg-primary-hover"
        dir="rtl"
      >
        تلاش دوباره
      </button>
    </main>
  );
}
