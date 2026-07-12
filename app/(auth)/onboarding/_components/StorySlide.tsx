import ProgressBar from "./ProgressBar";
import StoryCard from "./StoryCard";
import OnboardingActions from "./OnboardingActions";

interface StorySlideProps {
  backgroundImage: string;
  title: string;
  description: string;
  total: number;
  current: number;
  isLast: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export default function StorySlide({
  backgroundImage,
  title,
  description,
  total,
  current,
  isLast,
  onNext,
  onSkip,
}: StorySlideProps) {
  return (
    <div className="relative w-full h-full bg-slide-bg overflow-hidden rounded-lg">
      {/* Background image */}
      <div className="brand-media absolute inset-0 pointer-events-none">
        <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Top gradient overlay (dark at top, fades out) */}
      <div className="absolute top-0 left-0 right-0 h-[130px] bg-gradient-to-b from-black to-transparent" />

      {/* Status bar spacer */}
      <div className="absolute top-0 left-0 right-0 h-11" />

      {/* Progress bar */}
      <ProgressBar total={total} current={current} />

      <StoryCard title={title} description={description}>
        <OnboardingActions isLast={isLast} onNext={onNext} onSkip={onSkip} />
      </StoryCard>
    </div>
  );
}
