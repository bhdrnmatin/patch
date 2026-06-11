import StageDial from "./StageDial";

interface Props {
  title: string;
  nextLabel?: string;
  stage: number;
  totalStages: number;
}

/** White pill: status title + next-step hint, with the circular stage dial on the right. */
export default function MatchStageCard({ title, nextLabel, stage, totalStages }: Props) {
  return (
    <div className="w-full bg-white rounded-full p-1 flex items-center justify-end gap-4 shadow-card">
      <div className="flex flex-col items-end gap-1 text-right">
        <span className="text-sm font-bold text-ink-soft" dir="rtl">
          {title}
        </span>
        {nextLabel && (
          <span className="text-xs" dir="rtl">
            <span className="text-muted">مرحله بعد: </span>
            <span className="text-ink-soft">{nextLabel}</span>
          </span>
        )}
      </div>
      <StageDial current={stage} total={totalStages} />
    </div>
  );
}
