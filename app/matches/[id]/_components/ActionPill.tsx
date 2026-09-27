interface Props {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

/** Glass pill button on the hero (اشتراک گذاری / ویرایش). */
export default function ActionPill({ icon, label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 min-w-0 h-10 px-4 flex items-center justify-between rounded-[16px] bg-white/15 border border-white/25 backdrop-blur-[6px] text-white active:opacity-80"
    >
      {icon}
      {/* The label doubles as the pill's status («لینک کپی شد»), so it is announced. */}
      <span className="text-sm font-bold leading-4" dir="rtl" aria-live="polite">
        {label}
      </span>
    </button>
  );
}
