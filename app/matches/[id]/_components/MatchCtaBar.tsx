import BottomBar from "@/app/_components/BottomBar";

interface Props {
  label: string;
  caption?: string;
  onClick?: () => void;
}

/** Sticky bottom action bar: primary CTA + optional status caption. */
export default function MatchCtaBar({ label, caption, onClick }: Props) {
  return (
    <BottomBar className="border border-edge pt-4 flex flex-col items-center gap-3">
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
    </BottomBar>
  );
}
