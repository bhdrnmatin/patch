import OnboardingButton from "./OnboardingButton";

interface AuthActionsProps {
  nextLabel: string;
  onNext: () => void;
  onBack?: () => void;
}

export default function AuthActions({ nextLabel, onNext, onBack }: AuthActionsProps) {
  if (onBack) {
    return (
      <div className="flex gap-3 w-full">
        <OnboardingButton label="قبلی" variant="ghost" onClick={onBack} />
        <OnboardingButton label={nextLabel} variant="primary" onClick={onNext} />
      </div>
    );
  }

  return (
    <OnboardingButton label={nextLabel} variant="primary" onClick={onNext} fullWidth />
  );
}
