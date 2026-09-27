/**
 * Header art for every hero: the padel court from above, at a scale where you
 * only see a corner of it — the net, the centre line, the side wall, and the
 * ball.
 *
 * It's the same drawing `CourtLineup` puts under every match, blown up and
 * tilted, so the page's banner and its cards speak one language. It replaced
 * the court photo (2026-09-16 → the redesign): a photo can only ever be
 * *a* court; this is Patch's court, and it weighs nothing.
 *
 * Rules carried over from the photo, and why:
 * - **Held at the open height, anchored top.** The collapse clips the bottom
 *   and never rescales the art, so the collapsed bar keeps the deep top edge.
 * - **Its zones are the header's zones.** Deep blue at the top where the title
 *   and the collapsed bar sit (white on it clears 3:1 for large text), the
 *   brighter brand blue at the bottom behind the date strip, the ball
 *   bottom-left, clear of the buttons and the title.
 * - **No scrim.** The gradient does the scrim's job.
 */
export default function CourtBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 bg-court-deep">
      <svg
        viewBox="0 0 390 292"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-x-0 top-0 h-[calc(var(--hero-max)+1rem)] w-full"
      >
        <defs>
          <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1560BE" />
            <stop offset="0.55" stopColor="#1F7FE4" />
            <stop offset="1" stopColor="#33A3FF" />
          </linearGradient>
          {/* Floodlight: a soft pool of light behind the title. */}
          <radialGradient id="hero-flood" cx="0.78" cy="0.32" r="0.55">
            <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          {/* The net's mesh. */}
          <pattern id="hero-mesh" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0v5M0 0h5" stroke="#fff" strokeOpacity="0.28" strokeWidth="0.8" />
          </pattern>
        </defs>

        <rect width="390" height="292" fill="url(#hero-sky)" />

        <g transform="rotate(-9 195 146)">
          {/* Mowing stripes, the same eighths as the card court. */}
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={-120 + i * 80} y="-80" width="40" height="460" fill="#fff" fillOpacity="0.035" />
          ))}
          <g stroke="#fff" strokeOpacity="0.32" strokeWidth="2.5" fill="none">
            {/* Side wall, service line, centre line. */}
            <line x1="-60" y1="30" x2="470" y2="30" />
            <line x1="410" y1="30" x2="410" y2="380" />
            <line x1="44" y1="214" x2="410" y2="214" />
          </g>
          {/* The net: mesh band, shadow, tape, and its post on the wall. */}
          <rect x="30" y="30" width="14" height="360" fill="url(#hero-mesh)" />
          <line x1="41" y1="30" x2="41" y2="380" stroke="#00254D" strokeOpacity="0.22" strokeWidth="4" />
          <line x1="37" y1="30" x2="37" y2="380" stroke="#fff" strokeOpacity="0.75" strokeWidth="3" />
          <rect x="31" y="22" width="12" height="12" rx="2" fill="#fff" fillOpacity="0.8" />
        </g>

        <rect width="390" height="292" fill="url(#hero-flood)" />

        {/* The ball, and its shadow on the turf. */}
        <ellipse cx="98" cy="196" rx="15" ry="4.5" fill="#00254D" fillOpacity="0.28" />
        <circle cx="94" cy="176" r="14" fill="#C7F000" />
        <path d="M82.5 169.5c6 4 6 10.5 1.5 16M105.5 169c-6 4.5-6.5 11-1.5 16.5" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Open-state title size, stepped by title length so the longest one still
 * clears the left gutter at 390px (and on a 360px phone). ZWNJ doesn't take
 * width, so it doesn't count: فعالیت‌ها is 8 glyphs, not 9.
 *
 * Sized for Lalezar, which sets tighter than Yekan Bakh did, so each step
 * runs a little larger than it used to.
 *
 * The collapsed size lives in `.hero-collapse-title`, which reads this as
 * `--title-open`.
 */
export function heroTitleSize(title: string): number {
  const glyphs = title.replace(/‌/g, "").length;
  if (glyphs <= 4) return 80;
  if (glyphs <= 7) return 72;
  return 64;
}
