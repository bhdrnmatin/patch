/**
 * The sign-in screens are the court: a portrait phone is a padel court seen
 * from above, so the whole screen is one — back wall at the top, the net across
 * the middle, your half at the bottom where the card sits. The logo is on the
 * far side; the ball has just come over the net.
 *
 * It's the same drawing as the hero headers and every match card's lineup, at
 * full size, so the first screen already speaks the app's language. It replaced
 * the night photos with the Latin PATCH wordmark baked in.
 *
 * `fixed`, like the photos were: the art resolves against the layout viewport,
 * which no platform shrinks for the keyboard, so only the card moves.
 */
export default function AuthCourt() {
  return (
    <>
      <div aria-hidden className="auth-court fixed inset-0 overflow-hidden bg-court-deep">
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <defs>
            <linearGradient id="auth-turf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1560BE" />
              <stop offset="0.5" stopColor="#1F7FE4" />
              <stop offset="1" stopColor="#2E95F7" />
            </linearGradient>
            <radialGradient id="auth-flood" cx="0.5" cy="0.22" r="0.6">
              <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <pattern id="auth-mesh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M0 0v6M0 0h6" stroke="#fff" strokeOpacity="0.3" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="390" height="844" fill="url(#auth-turf)" />
          {/* Mowing stripes across the width. */}
          {Array.from({ length: 11 }, (_, i) => (
            <rect key={i} x="0" y={i * 80} width="390" height="40" fill="#fff" fillOpacity="0.03" />
          ))}
          {/* 20 × 10 m, portrait: the net at the middle, service lines 6.95 m
              either side of it. The centre line is drawn on your half only —
              on the far one it would run straight through the wordmark. */}
          <g stroke="#fff" strokeOpacity="0.3" strokeWidth="2.5" fill="none">
            <rect x="22" y="-20" width="346" height="884" />
            <line x1="22" y1="128" x2="368" y2="128" />
            <line x1="22" y1="716" x2="368" y2="716" />
            <line x1="195" y1="422" x2="195" y2="716" />
          </g>
          <rect x="0" y="414" width="390" height="16" fill="url(#auth-mesh)" />
          <line x1="0" y1="426" x2="390" y2="426" stroke="#00254D" strokeOpacity="0.2" strokeWidth="4" />
          <line x1="0" y1="422" x2="390" y2="422" stroke="#fff" strokeOpacity="0.8" strokeWidth="3" />
          <rect width="390" height="844" fill="url(#auth-flood)" />
          <ellipse cx="96" cy="494" rx="16" ry="5" fill="#00254D" fillOpacity="0.25" />
          <circle cx="92" cy="474" r="15" fill="#C7F000" />
          <path d="M79.5 467c6.5 4.5 6.5 11.5 1.5 17.5M104.5 466.5c-6.5 5-7 12-1.5 18" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* The far side of the net: who we are. */}
      <div className="fixed inset-x-0 top-[max(18vh,calc(env(safe-area-inset-top)+9rem))] flex flex-col items-center gap-2 text-white">
        <img src="/icons/app-192.png" alt="" className="size-16 rounded-[18px] shadow-[0_10px_30px_rgba(0,37,77,0.35)] ring-1 ring-white/20" />
        <h1 className="mt-3 font-display text-[104px] leading-none [text-shadow:0_8px_30px_rgba(0,37,77,0.35)]">پچ</h1>
        <p dir="rtl" className="mt-9 text-[15px] font-bold text-white/90">
          مَچ پیدا کن، جای خالی رو پر کن.
        </p>
      </div>
    </>
  );
}
