"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../../(auth)/_components/Button";
import { appScrollEl } from "@/app/_components/AppScroll";
import { clampView, cropRect, MAX_ZOOM, type CropView } from "@/lib/crop";

interface Props {
  file: File;
  onCancel: () => void;
  /** A 512×512 JPEG of what the circle showed. */
  onDone: (cropped: File) => void;
}

const OUT = 512;

/**
 * Telegram-style avatar crop: the picked photo behind a clear circle, the rest
 * dimmed. One finger pans, two pinch; the slider zooms too. The image always
 * covers the circle (`clampView`), so the result never has an empty edge.
 */
export default function PhotoCropper({ file, onCancel, onDone }: Props) {
  const [url] = useState(() => URL.createObjectURL(file));
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [view, setView] = useState<CropView>({ zoom: 1, x: 0, y: 0 });
  // Circle diameter: the screen width less a margin, capped for tablets.
  const [c] = useState(() => Math.min(window.innerWidth - 48, 320));
  const img = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  // Lock the page behind, like a sheet. That also stands down AppScroll's
  // pull-to-refresh, which would otherwise read a downward drag as a pull.
  useEffect(() => {
    const sc = appScrollEl();
    const prev = sc?.style.overflow ?? "";
    if (sc) sc.style.overflow = "hidden";
    return () => {
      if (sc) sc.style.overflow = prev;
    };
  }, []);

  const set = (v: CropView) => dims && setView(clampView(v, dims.w, dims.h, c));

  const dist = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) pinch.current = { dist: dist(), zoom: view.zoom };
  };
  const onMove = (e: React.PointerEvent) => {
    const last = pointers.current.get(e.pointerId);
    if (!last) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      // ponytail: zooms about the circle centre, not the pinch midpoint.
      set({ ...view, zoom: (pinch.current.zoom * dist()) / pinch.current.dist });
    } else if (pointers.current.size === 1) {
      set({ ...view, x: view.x + e.clientX - last.x, y: view.y + e.clientY - last.y });
    }
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const confirm = () => {
    if (!dims || !img.current) return;
    const { sx, sy, size } = cropRect(view, dims.w, dims.h, c);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = OUT;
    canvas.getContext("2d")?.drawImage(img.current, sx, sy, size, size, 0, 0, OUT, OUT);
    canvas.toBlob(
      (blob) => blob && onDone(new File([blob], "avatar.jpg", { type: "image/jpeg" })),
      "image/jpeg",
      0.9,
    );
  };

  const s = dims ? (c / Math.min(dims.w, dims.h)) * view.zoom : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="تنظیم تصویر پروفایل"
      className="fixed inset-x-0 top-0 z-[70] h-[var(--vvh,100dvh)] bg-black flex flex-col"
    >
      <p className="pt-[calc(var(--hero-gap)+1.5rem)] text-center text-base font-bold text-white" dir="rtl">
        تنظیم تصویر
      </p>

      <div
        className="relative flex-1 overflow-hidden touch-none select-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a local blob, nothing to optimise */}
        <img
          ref={img}
          src={url}
          alt=""
          draggable={false}
          onLoad={(e) => {
            setDims({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
            // Freed here, not in an effect cleanup: StrictMode's mount–unmount–
            // mount revoked it before the image read it. A loaded image stays
            // drawable to the canvas without its URL.
            URL.revokeObjectURL(url);
          }}
          className="absolute left-1/2 top-1/2 max-w-none pointer-events-none"
          style={
            dims
              ? {
                  width: dims.w * s,
                  height: dims.h * s,
                  transform: `translate(calc(-50% + ${view.x}px), calc(-50% + ${view.y}px))`,
                }
              : { opacity: 0 }
          }
        />
        {/* The clear circle; its spread shadow dims everything outside it. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"
          style={{ width: c, height: c }}
        />
      </div>

      <div className="px-6 pt-4 pb-[calc(1.5rem+var(--safe-b))] flex flex-col gap-5">
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={view.zoom}
          onChange={(e) => set({ ...view, zoom: Number(e.target.value) })}
          aria-label="بزرگ‌نمایی"
          className="w-full accent-primary"
          dir="ltr"
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <Button label="انصراف" variant="ghost" fullWidth onClick={onCancel} />
          </div>
          <div className="flex-1">
            <Button label="تایید" variant="primary" fullWidth onClick={confirm} disabled={!dims} />
          </div>
        </div>
      </div>
    </div>
  );
}
