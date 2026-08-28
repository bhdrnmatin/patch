"use client";

import { useRef } from "react";
import OtpBox from "./OtpBox";
import { toPersianDigits } from "@/lib/persian";

/** OTP code length. */
export const OTP_LENGTH = 5;

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function OtpInput({ value, onChange }: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? "");

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, index) + value.slice(index + 1);
      onChange(next);
      if (index > 0) inputs.current[index - 1]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = toPersianDigits(e.target.value.replace(/[^0-9۰-۹]/g, ""));
    if (!cleaned) return;
    // SMS autofill (autocomplete="one-time-code") delivers the whole code to a
    // single field in one event — spread it across the boxes like a paste.
    if (cleaned.length > 1) {
      const filled = cleaned.slice(0, OTP_LENGTH);
      onChange(filled);
      inputs.current[Math.min(filled.length, OTP_LENGTH - 1)]?.focus();
      return;
    }
    const next = value.slice(0, index) + cleaned + value.slice(index + 1);
    onChange(next.slice(0, OTP_LENGTH));
    if (index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = toPersianDigits(
      e.clipboardData.getData("text").replace(/[^0-9۰-۹]/g, "")
    ).slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
    inputs.current[nextFocus]?.focus();
  };

  return (
    <div className="flex gap-4 h-[49px] w-full" onPaste={handlePaste}>
      {digits.map((digit, i) => {
        const state = digit ? "filled" : i === value.length ? "active" : "empty";
        return (
          <div key={i} className="relative flex-1 h-full">
            <OtpBox value={digit} state={state} />
            {/* Not opacity-0: iOS and Android both withhold the long-press paste callout
                from a fully transparent field. Visible element, invisible contents —
                the OtpBox behind it draws the digit. */}
            <input
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={digit}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => inputs.current[i]?.select()}
              className="absolute inset-0 cursor-pointer bg-transparent border-0 p-0 text-transparent caret-transparent selection:bg-transparent focus:outline-none"
            />
          </div>
        );
      })}
    </div>
  );
}
