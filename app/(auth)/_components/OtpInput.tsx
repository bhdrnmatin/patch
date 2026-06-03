"use client";

import { useRef } from "react";
import OtpBox from "./OtpBox";
import { toPersianDigits } from "@/lib/persian";

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function OtpInput({ value, onChange }: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length: 5 }, (_, i) => value[i] ?? "");

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, index) + value.slice(index + 1);
      onChange(next);
      if (index > 0) inputs.current[index - 1]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = toPersianDigits(e.target.value.replace(/[^0-9۰-۹]/g, "")).slice(-1);
    if (!raw) return;
    const next = value.slice(0, index) + raw + value.slice(index + 1);
    onChange(next.slice(0, 5));
    if (index < 4) inputs.current[index + 1]?.focus();
  };

  return (
    <div className="flex gap-4 h-[49px] w-full">
      {digits.map((digit, i) => {
        const state = digit ? "filled" : i === value.length ? "active" : "empty";
        return (
          <div key={i} className="relative flex-1 h-full">
            <OtpBox value={digit} state={state} />
            <input
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => inputs.current[i]?.select()}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        );
      })}
    </div>
  );
}
