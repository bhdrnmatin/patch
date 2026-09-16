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

  /**
   * After any deletion the caret belongs on the first empty box.
   *
   * Both delete paths used to step to `index - 1`, which is the last *filled*
   * box — so erasing the ۵ of ۱۲۳۴۵ parked the caret on the ۴, and the next
   * digit typed replaced it: ۱۲۳۴_ became ۱۲۳۵_ instead of ۱۲۳۴۵. Typing only
   * ever appends when the caret is on the empty box, so that is where it goes.
   */
  const focusActive = (next: string) =>
    inputs.current[Math.min(next.length, OTP_LENGTH - 1)]?.focus();

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      // Delete this box's digit, or — when it is already empty, which is where
      // the caret sits after a full code — the one before it.
      const target = value[index] ? index : index - 1;
      if (target < 0) return;
      const next = value.slice(0, target) + value.slice(target + 1);
      onChange(next);
      focusActive(next);
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let cleaned = toPersianDigits(e.target.value.replace(/[^0-9۰-۹]/g, ""));
    // A filled box still holds its digit, so typing over it delivers two
    // characters — the old one and the new — and the autofill branch below read
    // that as a whole code arriving and replaced the value with just those two.
    // Retyping any filled box wiped the rest of the code and restarted at box ۱.
    // Keep the character that isn't the one already there; checking both ends
    // covers the caret landing before or after the existing digit.
    const current = value[index] ?? "";
    if (cleaned.length === 2 && current) {
      cleaned = cleaned[0] === current ? cleaned[1] : cleaned[0];
    }
    // Emptying a filled box — select-all then Delete, or the caret parked mid-code —
    // has to remove that digit. Bailing here left a box clearable by Backspace and
    // by nothing else. Same compaction Backspace does, so the two agree.
    if (!cleaned) {
      if (!value[index]) return;
      const next = value.slice(0, index) + value.slice(index + 1);
      onChange(next);
      focusActive(next);
      return;
    }
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
    <div className="flex justify-between gap-2 w-full" onPaste={handlePaste}>
      {digits.map((digit, i) => {
        const state = digit ? "filled" : i === value.length ? "active" : "empty";
        return (
          // Square, capped at 52px and spread across the row; on a narrow
          // phone flex-1 lets them shrink before the row can overflow.
          <div key={i} className="relative flex-1 max-w-[52px] aspect-square">
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
