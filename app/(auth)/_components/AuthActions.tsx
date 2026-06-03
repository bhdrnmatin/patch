import Button from "./Button";

interface AuthActionsProps {
  nextLabel: string;
  onNext: () => void;
  onBack?: () => void;
  backLabel?: string;
  disabled?: boolean;
}

export default function AuthActions({ nextLabel, onNext, onBack, backLabel = "قبلی", disabled }: AuthActionsProps) {
  if (onBack) {
    return (
      <div className="flex gap-3 w-full">
        <Button label={backLabel} variant="ghost" onClick={onBack} />
        <Button label={nextLabel} variant="primary" onClick={onNext} disabled={disabled} />
      </div>
    );
  }

  return (
    <Button label={nextLabel} variant="primary" onClick={onNext} disabled={disabled} fullWidth />
  );
}
