"use client";

import { useState } from "react";

interface Props {
  /** Club coordinates. The caller skips this component when it has neither. */
  lat: number;
  lng: number;
  /** Club name — goes in the map's alt text. */
  label: string;
}

/**
 * Static map + مسیریابی for one court.
 *
 * Shared by the match-details `CourtCard` and the create wizard's `StepLocation`,
 * which held byte-identical copies of both halves: the same hardcoded San
 * Francisco placeholder (`court-map.webp`) and the same `<button>` with no
 * onClick. Fixing one would have left the other wrong, so there is one now.
 *
 * The map is Neshan's static image, proxied through `/map/static` so
 * `NESHAN_API_KEY` stays server-side — an `<img>` can't send the `Api-Key`
 * header, and a `key=` in the src would ship the key to every client. It hides
 * itself if that request fails (no key configured, quota, Neshan down) rather
 * than leaving a broken-image icon in the card — per src, so a blip on one club
 * doesn't hide the map for the next one.
 *
 * مسیریابی is a plain link and needs no key, so it works with coordinates alone.
 * `nshn.ir` opens the Neshan app when it's installed and the web map otherwise;
 * it drops the user on the pin rather than starting a route, which is one tap
 * short of directions but asks for no geolocation permission.
 */
export default function CourtMap({ lat, lng, label }: Props) {
  // Both are the src they apply to, not booleans: `lat`/`lng` change under this
  // component every time the wizard's court picker changes club, and a boolean
  // would carry the previous map's verdict over — one failed load hid the map
  // for every club picked after it, for the life of the step.
  const [loadedSrc, setLoadedSrc] = useState("");
  const [failedSrc, setFailedSrc] = useState("");

  // 700×425 ≈ 2× the 203px-tall slot, so it stays sharp on a 3x phone without
  // pushing a 2048px image down a 3G connection.
  //
  // zoom 16, not 15: at 15 a suburban court sits in a field of unlabelled blocks.
  // 16 is where the side street the address names becomes legible — پدل‌پوینت is
  // "مهرشهر چمن ۱ پلاک ۱۶" and «چمن ۱» only shows up at 16.
  const src = `/map/static?latitude=${lat}&longitude=${lng}&zoom=16&width=700&height=425&style=light&marker=red`;

  return (
    <>
      {failedSrc !== src && (
        <div className="relative w-full h-[203px]">
          {/* The map is a round trip through the proxy and takes about two
              seconds on a phone. An <img> whose src changes keeps painting the
              OLD image until the new one decodes, so switching club left the
              previous club's map on screen — which reads as "my tap did
              nothing" rather than "this is loading". The new map is hidden
              until it has loaded and a placeholder pulses in its place, so the
              switch registers on the tap instead of on arrival. */}
          {loadedSrc !== src && (
            <div className="absolute inset-0 rounded-xl bg-edge/50 animate-pulse" />
          )}
          <img
            src={src}
            alt={`نقشه ${label}`}
            onLoad={() => setLoadedSrc(src)}
            onError={() => setFailedSrc(src)}
            className={`w-full h-[203px] rounded-xl object-cover transition-opacity duration-200 ${
              loadedSrc === src ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      )}
      <a
        href={`https://nshn.ir/?lat=${lat}&lng=${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-primary rounded-card px-4 py-3 text-sm font-bold leading-4 text-white text-center active:opacity-90"
        dir="rtl"
      >
        مسیریابی
      </a>
    </>
  );
}
