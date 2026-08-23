/**
 * Header art: a padel court at night, drawn rather than photographed.
 *
 * Replaces the blurred-backdrop + sharp-cutout image pair the art headers used
 * to layer. Vector, so it compresses with a collapsing header instead of
 * object-cover re-cropping into a face — which is what made the photo unusable
 * once `--collapse` passed ~0.5. `preserveAspectRatio="none"` is deliberate:
 * the court is meant to squash with the header, not letterbox inside it.
 *
 * Geometry is one head-on perspective — far edge 162→228 at y=104, near edge
 * -150→540 at y=330, both cropped by the 390×276 frame. The net sits at y=139,
 * the service line at y=200. The sky gradient (#0A4E92 → #3BA9FF) is what
 * carries white title text; there is no black scrim over this.
 *
 * Gradient ids are static — only one art header renders per page.
 */
export default function CourtBackdrop() {
  return (
    <svg
      viewBox="0 0 390 276"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="court-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A4E92" />
          <stop offset=".55" stopColor="#2489E4" />
          <stop offset="1" stopColor="#3BA9FF" />
        </linearGradient>
        <linearGradient id="court-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".20" />
          <stop offset=".7" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="court-floodlight" cx=".5" cy=".16" r=".62">
          <stop offset="0" stopColor="#BFE4FF" stopOpacity=".32" />
          <stop offset="1" stopColor="#BFE4FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="390" height="276" fill="url(#court-sky)" />
      <ellipse cx="195" cy="34" rx="250" ry="110" fill="url(#court-floodlight)" />
      <path d="M162 104 L228 104 L540 330 L-150 330 Z" fill="url(#court-surface)" />

      {/* Side walls, centre line, service line */}
      <line x1="162" y1="104" x2="-150" y2="330" stroke="#fff" strokeWidth="1.5" opacity=".4" />
      <line x1="228" y1="104" x2="540" y2="330" stroke="#fff" strokeWidth="1.5" opacity=".4" />
      <line x1="195" y1="104" x2="195" y2="330" stroke="#fff" strokeWidth="1" opacity=".18" />
      <line x1="30" y1="200" x2="360" y2="200" stroke="#fff" strokeWidth="1.2" opacity=".24" />

      {/* Net */}
      <rect x="99" y="139" width="193" height="11" fill="#fff" opacity=".12" />
      <line x1="99" y1="139" x2="292" y2="139" stroke="#fff" strokeWidth="1.5" opacity=".5" />
    </svg>
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
