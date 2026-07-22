"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { SelectOption } from "./AuthSelect";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  showLabel?: boolean;
  disabled?: boolean;
}

/**
 * Searchable select. The picker opens as a bottom sheet rendered in a portal, so
 * it isn't clipped by the auth card's overflow/backdrop-filter — reliable and
 * roomy on mobile.
 */
export default function AuthSearchSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "جستجو...",
  showLabel,
  disabled,
}: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const q = query.trim();
    return q ? options.filter((o) => o.label.includes(q)) : options;
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock scroll behind the sheet
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const openSheet = () => {
    if (disabled) return;
    setQuery("");
    setOpen(true);
  };
  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
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
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={openSheet}
          className="w-full h-full rounded-card bg-black/[0.32] border border-input-border pr-4 pl-9 text-sm leading-4 flex items-center justify-between focus:outline-none focus:border-primary shadow-card disabled:opacity-50"
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          // Full-screen picker: search pinned at top, list fills the rest. The
          // mobile keyboard just overlays the bottom of the list — nothing above
          // moves or resizes (unlike a bottom sheet).
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-card" dir="rtl">
            <div className="w-full mx-auto max-w-[430px] h-full flex flex-col">
              <div className="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
                <span className="text-base font-bold text-white">{label}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="بستن"
                  className="text-white/70 text-xl leading-none px-2"
                >
                  ✕
                </button>
              </div>
              <div className="px-4 pb-3 shrink-0">
                <input
                  autoFocus
                  dir="rtl"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-11 rounded-xl bg-black/30 border border-input-border px-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary"
                />
              </div>
              <ul role="listbox" className="flex-1 overflow-y-auto px-2 pb-6">
                {filtered.length === 0 ? (
                  <li className="px-4 py-4 text-sm text-white/40 text-center">موردی یافت نشد</li>
                ) : (
                  filtered.map((o) => (
                    <li key={o.value} role="option" aria-selected={o.value === value}>
                      <button
                        type="button"
                        onClick={() => pick(o.value)}
                        className={`w-full text-right px-4 py-3 rounded-xl text-sm transition-colors active:bg-white/10 ${
                          o.value === value ? "text-primary" : "text-white hover:bg-white/5"
                        }`}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
