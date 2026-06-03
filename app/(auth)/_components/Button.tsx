interface ButtonProps {
  label: string;
  variant: "ghost" | "primary";
  onClick: () => void;
  fullWidth?: boolean;
}

export default function Button({
  label,
  variant,
  onClick,
  fullWidth = false,
}: ButtonProps) {
  const base =
    "h-12 rounded-[44px] flex items-center justify-center px-4 cursor-pointer";
  const variants = {
    ghost: "bg-black/[0.19] border border-white/15",
    primary: "bg-[#33A3FF]",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : "flex-1 min-w-0"}`}
    >
      <span dir="rtl" className="font-bold text-[14px] leading-4 text-white whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
