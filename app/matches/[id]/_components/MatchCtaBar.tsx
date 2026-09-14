import BottomBar from "@/app/_components/BottomBar";

interface Props {
  label: string;
  caption?: string;
  /** In flight — blocks a second tap and tells assistive tech something is happening. */
  busy?: boolean;
  onClick?: () => void;
}

/** Sticky bottom action bar: primary CTA + optional status caption. */
export default function MatchCtaBar({ label, caption, busy = false, onClick }: Props) {
  return (
    <BottomBar className="border border-edge pt-4 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-busy={busy}
        className="w-full bg-primary rounded-card px-4 py-3 text-sm font-bold leading-4 text-white active:opacity-90 disabled:opacity-60"
        dir="rtl"
      >
        {label}
      </button>
      {caption && (
        <p className="text-xs text-ink-soft" dir="rtl">
          {caption}
        </p>
      )}
    </BottomBar>
  );
}
