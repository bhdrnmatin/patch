"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  /** Stored value — sent to the backend (e.g. "MALE"). */
  value: string;
  /** Displayed label (e.g. "آقا"). */
  label: string;
}

interface AuthSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  showLabel?: boolean;
}

/** Dark-glass dropdown matching AuthInput; opens a small option menu. */
export default function AuthSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  showLabel,
}: AuthSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="flex flex-col gap-1 w-full" ref={rootRef}>
      {showLabel && (
        <label
          htmlFor={id}
          dir="rtl"
          className="text-sm font-normal leading-6 tracking-normal text-white/80 px-1 cursor-pointer"
        >
          {label}
        </label>
      )}
      <div className="relative h-12 w-full">
        <button
          id={id}
          type="button"
          dir="rtl"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="w-full h-full rounded-card bg-black/[0.32] border border-input-border px-4 text-sm leading-4 flex items-center justify-between focus:outline-none focus:border-primary shadow-card"
        >
          <span className={selected ? "text-white" : "text-white/40"}>
            {selected ? selected.label : placeholder ?? label}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={`text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            dir="rtl"
            className="absolute top-full mt-2 w-full z-10 rounded-card bg-black/80 backdrop-blur-card border border-input-border shadow-pop overflow-hidden py-1"
          >
            {options.map((o) => {
              const isSelected = o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 text-sm leading-4 transition-colors active:bg-white/10 ${
                      isSelected ? "text-primary" : "text-white hover:bg-white/5"
                    }`}
                  >
                    {o.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
