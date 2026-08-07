"use client";

import type { DayOption } from "@/lib/types";
import { useScrolledPast } from "@/lib/useScrolledPast";
import CompactHeaderBar from "./CompactHeaderBar";
import IconButton from "./IconButton";
import DateSelector from "./DateSelector";
import { FilterSearchIcon, SortIcon } from "./icons";

/** Scroll depth at which the hero has all but left the viewport (276 − 100). */
const COMPACT_AT = 176;

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

/** Shared list-page hero: athlete background + title + filter/sort buttons + optional date strip. */
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
  const compact = useScrolledPast(COMPACT_AT);

  return (
    <>
      <CompactHeaderBar title={title} visible={compact}>
        <IconButton label="فیلتر" icon={<FilterSearchIcon />} onClick={onFilter} />
        <IconButton label="مرتب‌سازی" icon={<SortIcon />} onClick={onSort} />
      </CompactHeaderBar>

      <header className="relative h-[276px] bg-primary rounded-b-group overflow-hidden">
        {/* Blurred court backdrop with blue tint.
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
        <img src={athleteImage} alt="" className="absolute inset-0 w-full h-full object-cover" />

        {/* Top darkening gradient for contrast */}
        <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />

        {/* Filter + sort buttons (visual left). Off-screen once compact — the
            pinned bar's copies take over, so these leave the tab order. */}
        <div inert={compact} className="absolute left-6 top-14 flex items-center gap-2">
          <IconButton label="فیلتر" icon={<FilterSearchIcon />} onClick={onFilter} />
          <IconButton label="مرتب‌سازی" icon={<SortIcon />} onClick={onSort} />
        </div>

        <h1
          dir="rtl"
          className="absolute right-6 top-20 -translate-y-1/2 text-white text-2xl font-bold leading-8 drop-shadow-hero"
        >
          {title}
        </h1>

        {/* Date strip overlapping the bottom of the hero (omitted when no days) */}
        {days && (
          <div className="absolute inset-x-0 bottom-3">
            <DateSelector days={days} selectedId={selectedId ?? ""} onSelect={onSelect ?? (() => {})} />
          </div>
        )}
      </header>
    </>
  );
}
