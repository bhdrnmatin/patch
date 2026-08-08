"use client";

import { useEffect, useId, useRef } from "react";
import { CloseIcon } from "../../_components/icons";

interface Props {
  open: boolean;
  title: string;
  /** Glyph shown in the circular badge beside the title (sort / filter). Omit to hide the badge. */
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Fixed full height (vs. shrink-to-content). Use for sheets with a search
   * field so content stays top-anchored and the mobile keyboard just overlays
   * the bottom of a scrollable list instead of hiding it.
   */
  fill?: boolean;
}

/**
 * Floating glassmorphic dialog, inset from the screen edges.
 * Header: close button (left) · title + badge glyph (right).
 * Locks body scroll and closes on Escape while open.
 */
export default function BottomSheet({ open, title, icon, onClose, children, footer, fill }: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Callers pass an inline onClose, so its identity changes every render. Kept
  // in a ref so the effect below depends on `open` alone — otherwise every
  // parent render tore down the history entry and re-pushed it.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);

    // Make the hardware/browser back button close the sheet instead of
    // navigating to the previous URL: push a throwaway history entry and
    // close when it's popped.
    window.history.pushState({ sheet: true }, "");
    // Only a pop that leaves our marker behind is a real back press. A cleanup
    // below calls history.back() itself, and history.back() is async — under
    // StrictMode's mount/cleanup/mount that pop lands after the second effect
    // re-pushed the marker, and closing on it made the sheet flash open/shut.
    const onPop = () => {
      if (!window.history.state?.sheet) onCloseRef.current();
    };
    window.addEventListener("popstate", onPop);

    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      // Closed via UI (not the back button) — drop the entry we pushed so the
      // history stack stays balanced.
      if (window.history.state?.sheet) window.history.back();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Dim + blur overlay (click to dismiss; the close button handles keyboard) */}
      <div aria-hidden onClick={onClose} className="animate-fade-in absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Sheet card */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`animate-sheet-in relative w-[calc(100%-32px)] max-w-[398px] mb-4 rounded-sheet bg-white/80 backdrop-blur-[4px] p-6 flex flex-col gap-5 shadow-sheet outline-none ${
          fill ? "h-[calc(100dvh-32px)]" : "max-h-[calc(100dvh-32px)]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="size-8 flex items-center justify-center rounded-full border border-white/15 bg-black/[0.08] text-ink-soft"
          >
            <CloseIcon />
          </button>
          <div className="flex items-center gap-2">
            <h2 id={titleId} className="text-lg font-bold text-ink-soft">
              {title}
            </h2>
            {icon && (
              <span
                aria-hidden
                className="size-8 shrink-0 flex items-center justify-center rounded-full bg-black/[0.06] text-ink-soft"
              >
                {icon}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full flex-1 min-h-0 overflow-y-auto">{children}</div>

        {footer && <div className="flex items-center gap-4 w-full shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
