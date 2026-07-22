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

/**
 * Dark-glass dropdown matching AuthInput; opens a small inline option menu.
 * Best for short lists (e.g. gender) — long/searchable lists use AuthSearchSelect.
 */
export default function AuthSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  showLabel,
}: AuthSelectProps) {
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);

  const focusOption = (idx: number) => {
    const btns = Array.from(listRef.current?.querySelectorAll<HTMLElement>("li > button") ?? []);
    if (btns.length === 0) return;
    btns[Math.max(0, Math.min(idx, btns.length - 1))].focus();
  };
  const onListKeyDown = (e: React.KeyboardEvent) => {
    const btns = Array.from(listRef.current?.querySelectorAll<HTMLElement>("li > button") ?? []);
    const cur = btns.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusOption(cur + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusOption(cur <= 0 ? 0 : cur - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusOption(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusOption(btns.length - 1);
    }
  };

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
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && open) {
              e.preventDefault();
              focusOption(0);
            }
          }}
          className="w-full h-full rounded-card bg-black/[0.32] border border-input-border pr-4 pl-9 text-sm leading-4 flex items-center justify-between focus:outline-none focus:border-primary shadow-card"
        >
          <span className={selected ? "text-white" : "text-white/40"}>
            {selected ? selected.label : placeholder ?? label}
          </span>
        </button>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {open && (
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            dir="rtl"
            onKeyDown={onListKeyDown}
            className="absolute top-full mt-2 w-full z-20 rounded-card bg-black/80 backdrop-blur-card border border-input-border shadow-pop overflow-y-auto max-h-60 py-1"
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
