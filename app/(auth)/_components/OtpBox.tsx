interface OtpBoxProps {
  value: string;
  state: "empty" | "active" | "filled";
}

export default function OtpBox({ value, state }: OtpBoxProps) {
  const styles = {
    empty: "bg-black/[0.32] border-[1.5px] border-[#6783A0]",
    active: "bg-black/[0.32] border-[1.5px] border-[#33A3FF]",
    filled: "bg-[#33A3FF] border-[1.008px] border-[#33A3FF]",
  };

  return (
    <div
      className={`flex-1 h-full rounded-[32px] flex items-center justify-center ${styles[state]}`}
    >
      <span className="text-white font-bold text-[21.5px] leading-none">
        {value}
      </span>
    </div>
  );
}
