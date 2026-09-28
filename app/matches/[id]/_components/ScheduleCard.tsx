import { calendarHref, type CalendarEvent } from "@/lib/calendar";

interface Props {
  date: string;
  /** Signup deadline; omitted → the مهلت یارگیری row is hidden. */
  deadline?: string;
  timeRange: string;
  /** What «اضافه به تقویم» saves. Omitted → no button (a cancelled match). */
  calendar?: CalendarEvent;
}

/** Schedule card: big date banner, signup deadline, time range + add-to-calendar. */
export default function ScheduleCard({ date, deadline, timeRange, calendar }: Props) {
  return (
    <section className="w-full bg-white rounded-group p-3 flex flex-col gap-4.5 shadow-card">
      <div className="w-full h-[72px] bg-surface rounded-2xl flex items-center justify-center">
        <span className="text-title font-bold text-primary" dir="rtl">
          {date}
        </span>
      </div>
      {deadline && (
        <div className="w-full flex items-center justify-between">
          <span className="text-base leading-4 text-ink-soft" dir="rtl">
            {deadline}
          </span>
          <span className="text-sm leading-4 text-muted" dir="rtl">
            مهلت یارگیری
          </span>
        </div>
      )}
      <div className="w-full flex gap-2">
        <div className="flex-1 min-w-0 h-10 bg-surface rounded-group flex items-center justify-center text-sm text-ink-soft" dir="rtl">
          {timeRange}
        </div>
        {/* A plain link, not a button: a `text/calendar` response is what opens
            the phone's own "Add to Calendar" sheet — see app/calendar/route.ts.
            It had no handler at all before. */}
        {calendar && (
          <a
            href={calendarHref(calendar)}
            className="flex-1 min-w-0 h-10 bg-white border border-primary rounded-group flex items-center justify-center text-sm font-bold text-primary active:opacity-80"
            dir="rtl"
          >
            اضافه به تقویم
          </a>
        )}
      </div>
    </section>
  );
}
