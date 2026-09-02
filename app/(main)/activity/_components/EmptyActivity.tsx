import { DiscoverIcon } from "../../_components/BottomNav";

/** Shown on /activity when there are no activity sections to display. */
export default function EmptyActivity() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center" dir="rtl">
      <div className="size-16 rounded-full bg-surface flex items-center justify-center text-muted">
        <DiscoverIcon />
      </div>
      <p className="text-base font-bold text-ink">هنوز فعالیتی نیست</p>
      <p className="text-sm text-muted">در حال حاضر فعالیتی برای نمایش وجود ندارد.</p>
    </div>
  );
}
