import type { ActivityAction } from "@/lib/types";

const TONES: Record<ActivityAction["variant"], string> = {
  // Quiet grey, so the one blue button on a card is the answer you'd expect.
  outline: "bg-surface text-ink hover:bg-divider",
  filled: "bg-primary text-white hover:bg-primary-hover",
};

/** Compact pill action used at the bottom of an Activity card. Fills its row slot. */
export default function ActivityButton({
  label,
  variant,
  onClick,
  disabled,
}: ActivityAction & { onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 min-w-0 flex items-center justify-center h-11 rounded-[14px] px-2 text-xs font-bold leading-4 whitespace-nowrap active:opacity-80 disabled:opacity-40 ${TONES[variant]}`}
    >
      {label}
    </button>
  );
}
