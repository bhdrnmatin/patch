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
    <div className="relative w-full h-full bg-[#EEFFFC] overflow-hidden rounded-lg">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Top gradient overlay (dark at top, fades out) */}
      <div className="absolute top-0 left-0 right-0 h-[130px] bg-gradient-to-b from-black to-transparent" />

      {/* Status bar spacer */}
      <div className="absolute top-0 left-0 right-0 h-11" />

      {/* Progress bar */}
      <ProgressBar total={total} current={current} />

      {/* Content card */}
      <StoryCard title={title} description={description} />

      {/* Action buttons */}
      <OnboardingActions isLast={isLast} onNext={onNext} onSkip={onSkip} />
    </div>
  );
}
