/**
 * Header art for all five heroes: a night padel court photo
 * (`/images/hero-court.webp`, 1280×853), one shared image rather than one per
 * page — the titles already tell the pages apart.
 *
 * It replaced a drawn SVG court on 2026-09-16 (user decision, to continue the
 * night photos on login/OTP). The reason photos were dropped before was that
 * `object-cover` re-cropped them into a sliver of an athlete as the header
 * collapsed. This one can't: it is held at the *open* height and anchored to
 * the top, so collapsing only clips its bottom away and the bar keeps the dark
 * sky. The composition was generated around the header's zones — racket
 * bottom-left under the buttons, calm right half for the title, plain turf
 * behind the date strip.
 *
 * Nudged up 1rem (and grown by the same) so the ball sits mostly above the date
 * strip; it still tucks ~5px behind the first cell. Clearing it fully needs a
 * ~57px zoom, which crops the racket off the left edge — not worth it. `bg-night` shows while
 * the photo loads, the same navy as its shadows.
 */
export default function CourtBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 bg-night">
      <img
        src="/images/hero-court.webp"
        alt=""
        className="absolute inset-x-0 -top-4 h-[calc(var(--hero-max)+1rem)] w-full max-w-none object-cover"
      />
    </div>
  );
}

/**
 * Open-state title size, stepped by title length so the longest one still
 * clears the left gutter at 390px (and on a 360px phone). ZWNJ doesn't take
 * width, so it doesn't count: فعالیت‌ها is 8 glyphs, not 9.
 *
 * The collapsed size lives in `.hero-collapse-title`, which reads this as
 * `--title-open`.
 */
export function heroTitleSize(title: string): number {
  const glyphs = title.replace(/‌/g, "").length;
  if (glyphs <= 4) return 62;
  if (glyphs <= 7) return 54;
  return 44;
}
