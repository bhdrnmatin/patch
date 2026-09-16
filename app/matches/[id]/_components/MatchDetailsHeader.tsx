"use client";

import { useRouter } from "next/navigation";
import { useCollapseHeader } from "@/lib/useCollapseHeader";
import CourtBackdrop from "../../../(main)/_components/CourtBackdrop";
import IconButton from "../../../(main)/_components/IconButton";
import ActionPill from "./ActionPill";
import { ArrowLeftIcon, SendIcon, EditIcon } from "./icons";

interface Props {
  title: string;
  showEdit?: boolean;
  /** Blurred stadium backdrop. Omitted by default — the hero is solid `bg-primary`. */
  bgImage?: string;
  /** Sharp athlete foreground. Omitted by default (no art). */
  athleteImage?: string;
}

/**
 * Hero header: a drawn padel court, back button, match name, share/edit pills.
 *
 * Collapses on scroll like every other hero — same `useCollapseHeader`, same
 * `.hero-collapse*` rules, so the geometry stays in globals.css and this file
 * states none of it. The page carries `.hero-page` to guarantee the scroll
 * range, since a match with no description and no FAQ is a short page.
 *
 * The name is user data of any length, so `--title-open` is a fixed 32px rather
 * than stepping by glyph count like the list titles — it truncates instead. It
 * still lands at 19px collapsed, on the same track as the others.
 */
export default function MatchDetailsHeader({ title, showEdit = true, bgImage, athleteImage }: Props) {
  const router = useRouter();
  const ref = useCollapseHeader<HTMLElement>();

  return (
    <>
      <header
        ref={ref}
        className="hero-collapse fixed top-[var(--hero-gap)] left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] rounded-b-group overflow-hidden bg-night"
      >
        {!bgImage && !athleteImage && <CourtBackdrop />}

        {/* Blurred stadium backdrop behind the athlete cutout, mirrored per Figma.
            Sized relative to the frame (Figma: 502×335 at right -44 in a 390×276 frame)
            so it tracks the foreground athlete at any frame width. */}
        {bgImage && (
          <div className="absolute top-0 right-[-11.3%] w-[128.7%] h-[121.4%]">
            <img src={bgImage} alt="" className="size-full object-cover -scale-x-100 blur-[2px]" />
            <div className="absolute inset-0 bg-primary/55" />
          </div>
        )}
        {athleteImage && (
          <img src={athleteImage} alt="" className="absolute inset-0 size-full object-cover" />
        )}
        {/* Scrim only on the photo path — the court's sky gradient carries the
            title on its own. */}
        {(bgImage || athleteImage) && (
          <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />
        )}
        {/* Rides up and shrinks with the collapse, the same rule the list pages'
            filter/sort pair uses. */}
        <div className="hero-collapse-actions absolute left-6">
          <IconButton icon={<ArrowLeftIcon />} label="برگشت" onClick={() => router.back()} />
        </div>
        <h1
          style={{ "--title-open": "32px" } as React.CSSProperties}
          className="hero-collapse-title absolute right-6 -translate-y-1/2 max-w-[calc(100%-96px)] truncate font-bold leading-[1.15] text-white [text-shadow:0_4px_26px_rgba(2,26,55,0.45)]"
          dir="rtl"
        >
          {title}
        </h1>
        {/* The pills sit on the hero's bottom edge, so they ride up into the back
            button as it shrinks — the same collision the profile avatar has. Gone
            before the bar lands; the rule takes them to zero scale so the
            invisible buttons can't swallow a tap meant for برگشت. */}
        <div className="hero-collapse-pills absolute bottom-4 inset-x-4 flex gap-3">
          <ActionPill icon={<SendIcon />} label="اشتراک گذاری" />
          {showEdit && <ActionPill icon={<EditIcon />} label="ویرایش" />}
        </div>
      </header>

      {/* Fills --hero-gap so cards scrolling under the hero never show through
          above it. Zero-height wherever safe-area-inset-top is 0. */}
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
