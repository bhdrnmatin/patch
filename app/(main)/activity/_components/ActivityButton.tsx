import type { ActivityAction } from "@/lib/types";

const TONES: Record<ActivityAction["variant"], string> = {
  outline: "bg-white border border-primary text-primary hover:bg-surface",
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
      className={`flex-1 min-w-0 flex items-center justify-center rounded-card px-4 py-3 text-xs leading-4 active:opacity-80 disabled:opacity-40 ${TONES[variant]}`}
    >
      {label}
    </button>
  );
}
