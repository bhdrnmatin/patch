import { forwardRef } from "react";

interface ButtonProps {
  label: string;
  variant: "ghost" | "primary";
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, variant, onClick, fullWidth = false, disabled, type = "button" },
  ref
) {
  const base =
    "h-12 rounded-[44px] flex items-center justify-center px-4 cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed active:opacity-80";
  const variants = {
    ghost: "bg-black/[0.19] border border-white/15 hover:bg-black/30",
    primary: "bg-[#33A3FF] hover:bg-[#1a94f5]",
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : "flex-1 min-w-0"}`}
    >
      <span dir="rtl" className="font-bold text-[14px] leading-4 text-white whitespace-nowrap">
        {label}
      </span>
    </button>
  );
});

export default Button;
