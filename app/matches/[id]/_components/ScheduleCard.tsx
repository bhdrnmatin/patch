interface Props {
  date: string;
  /** Signup deadline; omitted → the مهلت یارگیری row is hidden. */
  deadline?: string;
  timeRange: string;
}

/**
 * Schedule card: the kick-off as a scoreboard — the window in the display face
 * on the court's run-off blue, the date over it — then the signup deadline.
 */
export default function ScheduleCard({ date, deadline, timeRange }: Props) {
  return (
    <section className="w-full bg-white rounded-[24px] p-2 flex flex-col gap-3 shadow-card">
      <div
        className="w-full rounded-[18px] bg-court-deep px-4 py-4 flex flex-col items-center gap-1 text-white"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 6.25%, transparent 6.25% 12.5%)",
        }}
      >
        <span className="text-sm font-bold text-white/85" dir="rtl">
          {date}
        </span>
        <span className="font-display text-[40px] leading-[1.15]" dir="rtl">
          {timeRange}
        </span>
      </div>
      {deadline && (
        <div className="w-full px-2 pb-1 flex items-center justify-between">
          <span className="text-base leading-4 text-ink-soft" dir="rtl">
            {deadline}
          </span>
          <span className="text-sm leading-4 text-muted" dir="rtl">
            مهلت یارگیری
          </span>
        </div>
      )}

    </section>
  );
}
