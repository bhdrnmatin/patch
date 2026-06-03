import { toPersianDigits } from "@/lib/persian";

interface AuthInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  numeric?: boolean;
  maxLength?: number;
}

export default function AuthInput({ label, value, onChange, placeholder, numeric, maxLength }: AuthInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let next = e.target.value;
    if (numeric) {
      next = next.replace(/[^0-9۰-۹]/g, "");
    }
    next = toPersianDigits(next);
    if (maxLength) next = next.slice(0, maxLength);
    onChange(next);
  };

  return (
    <div className="relative h-12 w-full">
      <input
        type="text"
        inputMode={numeric ? "numeric" : "text"}
        value={value}
        onChange={handleChange}
        dir="rtl"
        maxLength={maxLength}
        className="w-full h-full rounded-[32px] bg-black/[0.32] border border-[#6783A0] px-4 text-white text-[14px] leading-4 placeholder-white/40 focus:outline-none focus:border-[#33A3FF] shadow-[0px_2px_7px_0px_rgba(0,0,0,0.08)]"
        placeholder={placeholder ?? label}
      />
    </div>
  );
}
