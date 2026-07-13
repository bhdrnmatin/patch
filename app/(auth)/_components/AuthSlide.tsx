interface AuthSlideProps {
  backgroundImage: string;
  /** Focal point for the cropped bg, e.g. "30% 50%". Defaults to center. */
  objectPosition?: string;
  children: React.ReactNode;
}

export default function AuthSlide({ backgroundImage, objectPosition = "50% 50%", children }: AuthSlideProps) {
  return (
    <div className="relative w-full min-h-dvh overflow-hidden">
      <img
        src={backgroundImage}
        alt=""
        style={{ objectPosition }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* status bar spacer */}
      <div className="absolute top-0 left-0 right-0 h-11" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[362px]">
        {children}
      </div>
    </div>
  );
}
