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
      className="flex-1 min-w-0 h-10 px-4 flex items-center justify-between rounded-card bg-black/35 border-[1.5px] border-white/15 backdrop-blur-[2px] text-white active:opacity-80"
    >
      {icon}
      <span className="text-sm font-semibold leading-4" dir="rtl">
        {label}
      </span>
    </button>
  );
}
