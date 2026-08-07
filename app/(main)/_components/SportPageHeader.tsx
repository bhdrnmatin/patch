"use client";

import type { DayOption } from "@/lib/types";
import { useCollapseHeader } from "@/lib/useCollapseHeader";
import IconButton from "./IconButton";
import DateSelector from "./DateSelector";
import { FilterSearchIcon, SortIcon } from "./icons";

/** Open height; the images are drawn at this size and scale down from it. */
const HERO_MAX = 276;
/** Collapsed height — enough for the status bar + the action/title row, plus
 *  the shrunken date strip on pages that have one. With dates: the buttons
 *  bottom out at ~99px (48px at top-14, scaled 0.78) and the strip is ~45px
 *  tall (56 × 0.8) sitting 12px off the bottom, so 164 keeps a gap between
 *  them; anything under ~156 makes them touch. */
const HERO_MIN_WITH_DATES = 164;
const HERO_MIN_BARE = 112;

interface Props {
  /** Hero heading, e.g. "مَچ" or "تورنمنت". */
  title: string;
  /** Date strip days. Omit to render the hero without a date strip (e.g. Activity). */
  days?: DayOption[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onFilter: () => void;
  onSort: () => void;
  /** Blurred backdrop image. Defaults to the shared court scene. */
  bgImage?: string;
  /** Sharp foreground athlete image. Defaults to the shared two-athlete scene. */
  athleteImage?: string;
}

/**
 * Shared list-page hero: athlete background + title + filter/sort buttons +
 * optional date strip. Collapses as the page scrolls — every part (title,
 * buttons, date strip, athlete) shrinks together, driven by the single
 * `--collapse` value that `useCollapseHeader` writes onto the header.
 */
export default function SportPageHeader({
  title,
  days,
  selectedId,
  onSelect,
  onFilter,
  onSort,
  bgImage = "/images/matches-header-bg.webp",
  athleteImage = "/images/matches-header-athlete.webp",
}: Props) {
  const heroMin = days ? HERO_MIN_WITH_DATES : HERO_MIN_BARE;
  const ref = useCollapseHeader<HTMLElement>(HERO_MAX - heroMin);

  return (
    <>
      <header
        ref={ref}
        style={{ "--hero-max": `${HERO_MAX}px`, "--hero-min": `${heroMin}px` } as React.CSSProperties}
        className="hero-collapse fixed top-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] bg-primary rounded-b-group overflow-hidden"
      >
        {/* Blurred court backdrop with blue tint — the surface, so it fills the
            header at every size rather than scaling with the athlete.
            Figma: 414px wide anchored left in a 390 frame (left-aligned, right overflow) —
            proportional width keeps the baked-in athlete aligned with the cutout. */}
        <div className="absolute inset-0">
          <img
            src={bgImage}
            alt=""
            className="absolute top-0 left-0 h-full w-[106.2%] max-w-none object-cover blur-[2px]"
          />
          <div className="absolute inset-0 bg-primary/55" />
        </div>

        {/* Sharp athlete foreground */}
        <img
          src={athleteImage}
          alt=""
          className="hero-collapse-photo absolute inset-x-0 bottom-0 w-full h-[276px] object-cover"
        />

        {/* Top darkening gradient for contrast */}
        <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />

        {/* Filter + sort buttons (visual left) */}
        <div className="hero-collapse-actions absolute left-6 top-14 flex items-center gap-2">
          <IconButton label="فیلتر" icon={<FilterSearchIcon />} onClick={onFilter} />
          <IconButton label="مرتب‌سازی" icon={<SortIcon />} onClick={onSort} />
        </div>

        <h1
          dir="rtl"
          className="hero-collapse-title absolute right-6 top-20 -translate-y-1/2 text-white font-bold leading-8 drop-shadow-hero"
        >
          {title}
        </h1>

        {/* Date strip riding the bottom of the hero (omitted when no days) */}
        {days && (
          <div className="hero-collapse-dates absolute inset-x-0 bottom-3">
            <DateSelector days={days} selectedId={selectedId ?? ""} onSelect={onSelect ?? (() => {})} />
          </div>
        )}
      </header>

      {/* Holds the open height in flow so the collapsing fixed header above
          never reflows the page. */}
      <div aria-hidden style={{ height: HERO_MAX }} />
    </>
  );
}
