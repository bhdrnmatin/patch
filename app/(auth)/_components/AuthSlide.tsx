interface AuthSlideProps {
  backgroundImage: string;
  /** Focal point for the cropped bg, e.g. "30% 50%". Defaults to center. */
  objectPosition?: string;
  children: React.ReactNode;
}

export default function AuthSlide({ backgroundImage, objectPosition = "50% 50%", children }: AuthSlideProps) {
  return (
    <div className="relative w-full min-h-[var(--vvh,100dvh)] overflow-hidden">
      {/* fixed, not absolute. Absolute sized the art to the slide, and the slide
          is min-h:var(--vvh) — so the moment the keyboard opened, the art shrank
          with it. Chrome reports the post-keyboard visualViewport height on the
          *first* frame while the keyboard itself animates in over ~200ms, which
          left a band of bare `body` background under the card until the keyboard
          caught up, and re-cropped the photo on the way. `fixed` resolves against
          the layout viewport, which no platform shrinks for the keyboard, so the
          art covers the screen throughout and only the card moves. */}
      <img
        src={backgroundImage}
        alt=""
        style={{ objectPosition }}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* status bar spacer */}
      <div className="absolute top-0 left-0 right-0 h-11" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[362px]">
        {children}
      </div>
    </div>
  );
}
