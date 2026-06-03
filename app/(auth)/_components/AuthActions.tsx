import Button from "./Button";

interface AuthActionsProps {
  nextLabel: string;
  onNext: () => void;
  onBack?: () => void;
}

export default function AuthActions({ nextLabel, onNext, onBack }: AuthActionsProps) {
  if (onBack) {
    return (
      <div className="flex gap-3 w-full">
        <Button label="قبلی" variant="ghost" onClick={onBack} />
        <Button label={nextLabel} variant="primary" onClick={onNext} />
      </div>
    );
  }

  return (
    <Button label={nextLabel} variant="primary" onClick={onNext} fullWidth />
  );
}
