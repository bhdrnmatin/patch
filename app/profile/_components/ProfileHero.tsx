"use client";

import ProfileAvatarLive from "./ProfileAvatarLive";

interface Props {
  bgSrc?: string;
  athleteSrc?: string;
}

/**
 * Profile hero — static, and deliberately not a collapsing header.
 *
 * The collapse needs 204px of scroll (the `--hero-max`/`--hero-min` delta) to
 * finish. This page is ~780px tall, so it can only ever offer `780 - viewport`
 * — 60px on a typical phone — and `--collapse` topped out around 0.3, parking
 * the avatar mid-transition: shrunk, drifted in from the right edge and
 * hanging over the athlete art, aligned to nothing. /matches and /tournaments
 * keep `useCollapseHeader`; their lists are long enough to complete it.
 *
 * The avatar lives here rather than in ProfileIdentity because it straddles
 * the header's bottom edge and hangs 48px below it — the overlap the identity
 * block used to create with -mt-12, and what its pt-[60px] clears.
 */
export default function ProfileHero({
  bgSrc = "/images/profile-hero-bg.webp",
  athleteSrc = "/images/profile-athlete.webp",
}: Props) {
  return (
    // z-20 so the overhanging avatar paints over the identity block below it.
    <header className="relative z-20 w-full h-[276px] bg-primary rounded-b-group">
      {/* Art layer — clipped so the images stay inside the rounded header
          while the avatar below is free to hang over its bottom edge. */}
      <div className="absolute inset-0 overflow-hidden rounded-b-group">
        {/* Blurred court background + blue tint.
            Figma: 414px wide anchored left in a 390 frame (left-aligned, right overflow) —
            proportional width keeps the baked-in athlete aligned with the cutout. */}
        {bgSrc && (
          <>
            <img
              src={bgSrc}
              alt=""
              className="absolute top-0 left-0 h-full w-[106.2%] max-w-none object-cover blur-[2px]"
            />
            <div className="absolute inset-0 bg-primary/55" />
          </>
        )}

        {/* Sharp athlete foreground. */}
        {athleteSrc && (
          <img
            src={athleteSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Top darkening gradient for title contrast */}
        <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />
      </div>

      <h1
        className="absolute right-6 top-20 -translate-y-1/2 text-2xl text-white font-bold leading-8 drop-shadow-hero"
        dir="rtl"
      >
        پروفایل
      </h1>

      {/* Straddles the bottom edge: 96px avatar, half of it hanging below. */}
      <div className="absolute right-6 bottom-0 translate-y-12">
        <ProfileAvatarLive />
      </div>
    </header>
  );
}
