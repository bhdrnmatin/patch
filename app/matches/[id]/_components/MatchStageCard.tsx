import StageDial from "./StageDial";

interface Props {
  title: string;
  nextLabel?: string;
  stage: number;
  /** Omitted for a state that isn't a step — a cancelled match draws no dial. */
  totalStages?: number;
}

/** White pill: status title + next-step hint, with the circular stage dial on the right. */
export default function MatchStageCard({ title, nextLabel, stage, totalStages }: Props) {
  return (
    // Without the dial the pill has nothing holding its right edge open, so it
    // takes the dial's height and its padding instead of collapsing to the text.
    <div
      className={`w-full min-h-16 bg-white rounded-full p-1 flex items-center justify-end gap-4 shadow-card ${
        totalStages === undefined ? "pr-6" : ""
      }`}
    >
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
      {totalStages !== undefined && <StageDial current={stage} total={totalStages} />}
    </div>
  );
}
