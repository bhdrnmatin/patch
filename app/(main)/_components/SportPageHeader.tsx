"use client";

import type { DayOption } from "@/lib/types";
import { useCollapseHeader } from "@/lib/useCollapseHeader";
import IconButton from "./IconButton";
import DateSelector from "./DateSelector";
import { FilterSearchIcon, SortIcon } from "./icons";
import CourtBackdrop, { heroTitleSize } from "./CourtBackdrop";

interface Props {
  /** Hero heading, e.g. "مَچ" or "تورنمنت". */
  title: string;
  /** Date strip days. Omit to render the hero without a date strip (e.g. Activity). */
  days?: DayOption[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onFilter: () => void;
  onSort: () => void;
  /** Blurred backdrop image. Omitted by default — the hero draws `CourtBackdrop`.
   *  Pass null alongside an opaque `athleteImage` to let that scene fill the header. */
  bgImage?: string | null;
  /** Sharp foreground athlete image. Omitted by default (the court is drawn, not shot). */
  athleteImage?: string | null;
}

/**
 * Shared list-page hero: a drawn padel court (`CourtBackdrop`) + an oversized
 * title + filter/sort buttons + optional date strip. Collapses as the page
 * scrolls — every part shrinks together, driven by the single `--collapse`
 * value that `useCollapseHeader` writes onto the header.
 *
 * Passing `athleteImage` swaps the court back out for the old photo pair; the
 * layers and their no-ghost rules are unchanged for that path.
 */
export default function SportPageHeader({
  title,
  days,
  selectedId,
  onSelect,
  onFilter,
  onSort,
  bgImage = null,
  athleteImage = null,
}: Props) {
  const ref = useCollapseHeader<HTMLElement>();

  return (
    <>
      <header
        ref={ref}
        className={`hero-collapse ${days ? "hero-collapse-dates" : ""} fixed top-[var(--hero-gap)] left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] bg-primary rounded-b-group overflow-hidden`}
      >
        {/* Art: the drawn court by default, the photo pair when one is passed.
            Figma's photo geometry (414px backdrop anchored left in a 390 frame)
            is preserved on that path so a restored image still lines up. */}
        {!bgImage && !athleteImage && <CourtBackdrop />}

        {bgImage && (
          <div className="absolute inset-0">
            <img
              src={bgImage}
              alt=""
              className="absolute top-0 left-0 h-full w-[106.2%] max-w-none object-cover blur-[2px]"
            />
            <div className="absolute inset-0 bg-primary/55" />
          </div>
        )}

        {/* Over a backdrop: height is the open height, not 100% — it scales down
            from there rather than letting object-cover re-crop as the header
            shrinks. On its own (no backdrop) it fills the header instead. */}
        {athleteImage &&
          (bgImage ? (
            <img
              src={athleteImage}
              alt=""
              className="hero-collapse-photo absolute inset-x-0 bottom-0 h-[var(--hero-max)] w-full object-cover"
            />
          ) : (
            <img src={athleteImage} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
          ))}

        {/* Filter + sort buttons (visual left). `top` comes from the collapse
            rules, not a utility, so it can ride up as the header shrinks. */}
        <div className="hero-collapse-actions absolute left-6 flex items-center gap-2">
          <IconButton label="فیلتر" icon={<FilterSearchIcon />} onClick={onFilter} />
          <IconButton label="مرتب‌سازی" icon={<SortIcon />} onClick={onSort} />
        </div>

        <h1
          dir="rtl"
          style={{ "--title-open": `${heroTitleSize(title)}px` } as React.CSSProperties}
          className="hero-collapse-title absolute right-6 -translate-y-1/2 whitespace-nowrap text-white font-bold leading-[1.15] [text-shadow:0_4px_26px_rgba(2,26,55,0.45)]"
        >
          {title}
        </h1>

        {/* Date strip riding the bottom of the hero (omitted when no days).
            Full size at every collapse step: scaling a right-anchored RTL scroll
            container left a gap on the left instead of shrinking about centre. */}
        {days && (
          <div className="absolute inset-x-0 bottom-3">
            <DateSelector days={days} selectedId={selectedId ?? ""} onSelect={onSelect ?? (() => {})} />
          </div>
        )}
      </header>

      {/* Fills --hero-gap so cards scrolling under the hero never show through
          above it. Zero-height wherever safe-area-inset-top is 0, which is a
          Safari tab and today's standalone PWA both. See --hero-gap. */}
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
