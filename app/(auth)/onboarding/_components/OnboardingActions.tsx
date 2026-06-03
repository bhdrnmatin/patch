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
  return (
    <div className="absolute bottom-4 left-0 right-0 h-20 flex items-center px-6">
      {isLast ? (
        <Button
          label="شروع کنیم پس!"
          variant="primary"
          onClick={onNext}
          fullWidth
        />
      ) : (
        <div className="flex gap-3 w-full">
          <Button
            label="رد کردن"
            variant="ghost"
            onClick={onSkip}
          />
          <Button
            label="بعدی"
            variant="primary"
            onClick={onNext}
          />
        </div>
      )}
    </div>
  );
}
