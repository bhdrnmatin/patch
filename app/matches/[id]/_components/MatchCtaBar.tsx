interface Props {
  label: string;
  caption?: string;
  onClick?: () => void;
}

/** Sticky bottom action bar: primary CTA + optional status caption. */
export default function MatchCtaBar({ label, caption, onClick }: Props) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border border-edge rounded-t-3xl px-6 pt-4 pb-6 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-primary rounded-card px-4 py-3 text-sm font-bold leading-4 text-white active:opacity-90"
        dir="rtl"
      >
        {label}
      </button>
      {caption && (
        <p className="text-xs text-ink-soft" dir="rtl">
          {caption}
        </p>
      )}
    </div>
  );
}
