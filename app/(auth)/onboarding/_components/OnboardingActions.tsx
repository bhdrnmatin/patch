import Button from "../../_components/Button";

interface OnboardingActionsProps {
  isLast: boolean;
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingActions({
  isLast,
  onNext,
  onSkip,
}: OnboardingActionsProps) {
  if (isLast) {
    return (
      <Button label="شروع کنیم پس!" variant="primary" onClick={onNext} fullWidth />
    );
  }

  return (
    <div className="flex gap-3 w-full">
      <Button label="رد کردن" variant="ghost" onClick={onSkip} />
      <Button label="بعدی" variant="primary" onClick={onNext} />
    </div>
  );
}
