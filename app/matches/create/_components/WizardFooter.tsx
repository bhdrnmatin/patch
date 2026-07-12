"use client";

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

/** Fixed bottom action bar: primary next/submit (left) + optional back (right, RTL). */
export default function WizardFooter({
  nextLabel,
  onNext,
  nextDisabled,
  pending,
  backLabel = "قبلی",
  onBack,
}: Props) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border border-edge rounded-t-group px-6 pt-4 pb-6 flex gap-3">
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
