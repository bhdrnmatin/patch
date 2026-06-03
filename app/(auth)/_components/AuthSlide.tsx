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
      <div className="absolute top-0 left-0 right-0 h-11" />
      {children}
    </div>
  );
}
