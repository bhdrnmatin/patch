"use client";

interface Props {
  labels: string[];
  /** 0-based current step. */
  current: number;
  /** Furthest step reached — any step up to it is tappable (back and forward). */
  maxStep: number;
  onJump: (index: number) => void;
}

/** RTL scrollable step strip: current = solid, reached = tappable outline, unreached = disabled. */
export default function StepChips({ labels, current, maxStep, onJump }: Props) {
  return (
    <div
      dir="rtl"
      className="flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {labels.map((label, i) => {
        const tone =
          i === current
            ? "bg-primary text-white border-primary"
            : i <= maxStep
              ? "bg-white text-primary border-primary/40 active:opacity-80"
              : "bg-white text-muted border-edge";
        return (
          <button
            key={label}
            type="button"
            disabled={i > maxStep}
            aria-current={i === current ? "step" : undefined}
            onClick={() => i !== current && i <= maxStep && onJump(i)}
            className={`h-11 px-4 shrink-0 rounded-full border text-xs font-bold whitespace-nowrap ${tone}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
