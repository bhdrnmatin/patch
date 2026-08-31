"use client";

import { useCollapseHeader } from "@/lib/useCollapseHeader";
import CourtBackdrop, { heroTitleSize } from "../../(main)/_components/CourtBackdrop";
import ProfileAvatarLive from "./ProfileAvatarLive";

interface Props {
  /** Blurred court backdrop. Omitted by default — the hero draws `CourtBackdrop`. */
  bgSrc?: string;
  /** Sharp athlete foreground. Omitted by default (the court is drawn, not shot). */
  athleteSrc?: string;
}

/**
 * Profile hero — a collapsing header, matching the list pages.
 *
 * It used to be static. The collapse needs 204px of scroll to finish and this
 * page is ~780px tall, so it could only ever offer `780 - viewport` — about
 * 60px — and `--collapse` topped out around 0.3, parking every part
 * mid-transition. `.hero-page` on the page root now guarantees the range
 * whatever the content height, so the reason is gone.
 *
 * The avatar is the part that made it awkward: it straddles the header's
 * bottom edge and hangs 48px below, so it rides up with the collapse and would
 * land on the content below the collapsed bar. `.hero-collapse-avatar` fades
 * and shrinks it out by the halfway point instead, leaving the same title-only
 * bar the other pages collapse to. It lives here rather than in
 * ProfileIdentity because of that overhang — which is what that block's
 * pt-[60px] clears.
 */
export default function ProfileHero({ bgSrc, athleteSrc }: Props) {
  const ref = useCollapseHeader<HTMLElement>();

  return (
    <>
      {/* No overflow-hidden: the art layer clips itself, so the avatar stays
          free to hang over the bottom edge. z-30 paints it over the identity
          block below (which is z-10). */}
      <header
        ref={ref}
        className="hero-collapse fixed top-[var(--hero-gap)] left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] bg-primary rounded-group"
      >
        {/* Art layer — clipped so the images stay inside the rounded header
            while the avatar below is free to hang over its bottom edge. */}
        <div className="absolute inset-0 overflow-hidden rounded-group">
          {!bgSrc && !athleteSrc && <CourtBackdrop />}

          {/* Photo path, kept for a restored image: Figma's 414px backdrop
              anchored left in a 390 frame, proportional so the baked-in athlete
              stays aligned with the cutout. */}
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

          {athleteSrc && (
            <img src={athleteSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}

          {bgSrc || athleteSrc ? (
            <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />
          ) : null}
        </div>

        <h1
          style={{ "--title-open": `${heroTitleSize("پروفایل")}px` } as React.CSSProperties}
          className="hero-collapse-title absolute right-6 -translate-y-1/2 whitespace-nowrap text-white font-bold leading-[1.15] [text-shadow:0_4px_26px_rgba(2,26,55,0.45)]"
          dir="rtl"
        >
          پروفایل
        </h1>

        {/* Straddles the bottom edge: 96px avatar, half of it hanging below.
            The overhang and the collapse scaling both live in the rule. */}
        <div className="hero-collapse-avatar absolute right-6 bottom-0">
          <ProfileAvatarLive />
        </div>
      </header>

      {/* The surface band the hero sits below — fixed too, so content
          scrolling under the hero never shows through it. See --hero-gap. */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 z-40 h-[var(--hero-gap)] w-full max-w-[430px] bg-surface"
      />

      {/* Holds the open height in flow so the collapsing fixed header above
          never reflows the page. */}
      <div aria-hidden className="h-[calc(var(--hero-max)+var(--hero-gap))]" />
    </>
  );
}
