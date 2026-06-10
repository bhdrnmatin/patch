"use client";

import { useEffect, useId, useRef } from "react";
import { CloseIcon } from "./icons";

interface Props {
  open: boolean;
  title: string;
  /** Glyph shown in the circular badge beside the title (sort / filter). */
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Floating glassmorphic dialog, inset from the screen edges.
 * Header: close button (left) · title + badge glyph (right).
 * Locks body scroll and closes on Escape while open.
 */
export default function BottomSheet({ open, title, icon, onClose, children, footer }: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Dim + blur overlay (click to dismiss; the close button handles keyboard) */}
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Sheet card */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-[calc(100%-32px)] max-w-[398px] mb-4 rounded-[40px] bg-white/80 backdrop-blur-[4px] p-6 flex flex-col gap-5 shadow-[0px_8px_32px_rgba(37,51,67,0.16)] outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="size-8 flex items-center justify-center rounded-[20px] border border-white/15 bg-black/[0.08] text-[#253343]"
          >
            <CloseIcon />
          </button>
          <div className="flex items-center gap-2">
            <h2 id={titleId} className="text-lg font-bold text-[#253343]">
              {title}
            </h2>
            <span
              aria-hidden
              className="size-8 shrink-0 flex items-center justify-center rounded-full bg-black/[0.06] text-[#253343]"
            >
              {icon}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full">{children}</div>

        {footer && <div className="flex items-center gap-4 w-full">{footer}</div>}
      </div>
    </div>
  );
}
