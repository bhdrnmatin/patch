interface OtpBoxProps {
  value: string;
  state: "empty" | "active" | "filled";
}

export default function OtpBox({ value, state }: OtpBoxProps) {
  const styles = {
    empty: "bg-black/[0.32] border-[1.5px] border-input-border",
    active: "bg-black/[0.32] border-[1.5px] border-primary",
    filled: "bg-primary border-[1.008px] border-primary",
  };

  return (
    <div
      aria-hidden="true"
      className={`flex-1 h-full rounded-card flex items-center justify-center ${styles[state]}`}
    >
      <span className="text-white font-bold text-otp leading-none">
        {value}
      </span>
    </div>
  );
}
