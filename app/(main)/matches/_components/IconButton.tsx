interface Props {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

/** Circular glassmorphic icon button used in the Matches header. */
export default function IconButton({ icon, label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="size-12 shrink-0 flex items-center justify-center rounded-full bg-black/[0.16] border border-white/15 backdrop-blur-[2px] text-white active:opacity-80"
    >
      {icon}
    </button>
  );
}
