interface AuthSlideProps {
  backgroundImage: string;
  children: React.ReactNode;
}

export default function AuthSlide({ backgroundImage, children }: AuthSlideProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* status bar spacer */}
      <div className="absolute top-0 left-0 right-0 h-11" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[362px]">
        {children}
      </div>
    </div>
  );
}
