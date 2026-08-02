interface Props {
  bgSrc?: string;
  athleteSrc?: string;
}

export default function ProfileHero({
  bgSrc = "/images/profile-hero-bg.webp",
  athleteSrc = "/images/profile-athlete.webp",
}: Props) {
  return (
    <div className="relative h-[276px] bg-primary rounded-b-group overflow-hidden">
      {/* Blurred court background + blue tint.
          Figma: 414px wide anchored left in a 390 frame (left-aligned, right overflow) —
          proportional width keeps the baked-in athlete aligned with the cutout. */}
      {bgSrc && (
        <div className="absolute inset-0">
          <img
            src={bgSrc}
            alt=""
            className="absolute top-0 left-0 h-full w-[106.2%] max-w-none object-cover blur-[2px]"
          />
          <div className="absolute inset-0 bg-primary/55" />
        </div>
      )}

      {/* Sharp athlete foreground */}
      {athleteSrc && (
        <img
          src={athleteSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Top darkening gradient for title/button contrast */}
      <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />

      <h1
        className="absolute right-6 top-20 -translate-y-1/2 text-white text-2xl font-bold leading-8 drop-shadow-hero"
        dir="rtl"
      >
        پروفایل
      </h1>
    </div>
  );
}
