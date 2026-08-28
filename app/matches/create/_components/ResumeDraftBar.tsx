interface ResumeDraftBarProps {
  onResume: () => void;
  onDiscard: () => void;
}

/**
 * Offered at the top of step ۱ when a half-finished match is in storage. It
 * replaces an on-exit "save as draft?" prompt: the App Router can't reliably
 * intercept a leave (hardware back, a nav tap and a swipe all slip past), so the
 * draft is saved without asking and the choice is made on the way back in.
 */
export default function ResumeDraftBar({ onResume, onDiscard }: ResumeDraftBarProps) {
  return (
    <section className="w-full bg-white border border-edge rounded-group p-4 shadow-card flex flex-col gap-3">
      {/* LTR wrapper so items-end pins right; dir on the text itself. */}
      <div className="flex flex-col items-end text-right gap-1">
        <p dir="rtl" className="text-sm font-bold text-ink">
          مَچ نیمه‌تمام دارید
        </p>
        <p dir="rtl" className="text-xs text-muted">
          می‌توانید از همان‌جا که رها کردید ادامه دهید.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onResume}
          className="flex-1 h-12 rounded-pill bg-primary text-sm font-bold text-white active:opacity-80"
        >
          ادامه
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="flex-1 h-12 rounded-pill border border-edge bg-white text-sm font-bold text-ink-soft active:opacity-80"
        >
          شروع دوباره
        </button>
      </div>
    </section>
  );
}
