"use client";

import { useCollapseHeader } from "@/lib/useCollapseHeader";
import ProfileAvatarLive from "./ProfileAvatarLive";

/** Open height; the athlete photo is drawn at this size and scales down from it. */
const HERO_MAX = 276;
/** Collapsed height — status bar + the title/avatar row. */
const HERO_MIN = 112;

interface Props {
  bgSrc?: string;
  athleteSrc?: string;
}

/**
 * Profile hero. Collapses as the page scrolls — title, athlete photo and the
 * avatar all shrink together off the single `--collapse` value.
 *
 * The avatar lives here rather than in ProfileIdentity: it straddles the
 * header's bottom edge, and a fixed header would otherwise paint over it. It
 * hangs 48px below the edge when open (the overlap the identity block used to
 * create with -mt-12) and tucks in beside the title once collapsed.
 */
export default function ProfileHero({
  bgSrc = "/images/profile-hero-bg.webp",
  athleteSrc = "/images/profile-athlete.webp",
}: Props) {
  const ref = useCollapseHeader<HTMLElement>(HERO_MAX - HERO_MIN);

  return (
    <>
      <header
        ref={ref}
        style={{ "--hero-max": `${HERO_MAX}px`, "--hero-min": `${HERO_MIN}px` } as React.CSSProperties}
        className="hero-collapse fixed top-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] bg-primary rounded-b-group"
      >
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

          {/* Sharp athlete foreground */}
          {athleteSrc && (
            <img
              src={athleteSrc}
              alt=""
              className="hero-collapse-photo absolute inset-x-0 bottom-0 w-full h-[276px] object-cover"
            />
          )}

          {/* Top darkening gradient for title contrast */}
          <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />
        </div>

        <h1
          className="hero-collapse-title absolute right-6 top-20 -translate-y-1/2 text-white font-bold leading-8 drop-shadow-hero"
          dir="rtl"
        >
          پروفایل
        </h1>

        <div className="hero-collapse-avatar absolute right-6 bottom-0">
          <ProfileAvatarLive />
        </div>
      </header>

      {/* Holds the open height in flow so the collapsing fixed header above
          never reflows the page. */}
      <div aria-hidden style={{ height: HERO_MAX }} />
    </>
  );
}
