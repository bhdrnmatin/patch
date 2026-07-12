"use client";

interface Props {
  labels: string[];
  /** 0-based current step. */
  current: number;
  /** Jump target — only past steps are tappable. */
  onJump: (index: number) => void;
}

/** RTL scrollable step strip: current = solid, past = tappable outline, future = disabled. */
export default function StepChips({ labels, current, onJump }: Props) {
  return (
    <div
      dir="rtl"
      className="flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {labels.map((label, i) => {
        const tone =
          i === current
            ? "bg-primary text-white border-primary"
            : i < current
              ? "bg-white text-primary border-primary/40 active:opacity-80"
              : "bg-white text-muted border-edge";
        return (
          <button
            key={label}
            type="button"
            disabled={i > current}
            aria-current={i === current ? "step" : undefined}
            onClick={() => i < current && onJump(i)}
            className={`h-11 px-4 shrink-0 rounded-full border text-xs font-semibold whitespace-nowrap ${tone}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
