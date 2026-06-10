interface Props {
  date: string;
  deadline: string;
  timeRange: string;
}

/** Schedule card: big date banner, signup deadline, time range + add-to-calendar. */
export default function ScheduleCard({ date, deadline, timeRange }: Props) {
  return (
    <section className="w-full bg-white rounded-3xl p-3 flex flex-col gap-[18px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06)]">
      <div className="w-full h-[72px] bg-surface rounded-2xl flex items-center justify-center">
        <span className="text-title font-bold text-primary" dir="rtl">
          {date}
        </span>
      </div>
      <div className="w-full flex items-center justify-between">
        <span className="text-base leading-4 text-ink-soft" dir="rtl">
          {deadline}
        </span>
        <span className="text-sm leading-4 text-muted" dir="rtl">
          مهلت یارگیری
        </span>
      </div>
      <div className="w-full flex gap-2">
        <div className="flex-1 min-w-0 h-10 bg-surface rounded-3xl flex items-center justify-center text-sm text-ink-soft" dir="rtl">
          {timeRange}
        </div>
        <button
          type="button"
          className="flex-1 min-w-0 h-10 bg-white border border-primary rounded-3xl flex items-center justify-center text-sm font-semibold text-primary active:opacity-80"
          dir="rtl"
        >
          اضافه به تقویم
        </button>
      </div>
    </section>
  );
}
