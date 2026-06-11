import InfoBanner from "./InfoBanner";
import { EditIcon } from "./icons";

interface Props {
  club: string;
  note: string;
}

/** اطلاعات زمین card: club name, notice banner, map, and routing button. */
export default function CourtCard({ club, note }: Props) {
  return (
    <section className="w-full bg-white rounded-3xl p-3 flex flex-col items-center gap-2 shadow-card">
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          aria-label="ویرایش زمین"
          className="p-2 rounded-3xl bg-surface text-ink-soft active:opacity-70"
        >
          <EditIcon className="size-4" />
        </button>
        <span className="text-base text-muted" dir="rtl">
          اطلاعات زمین
        </span>
      </div>
      <h2 className="text-display font-bold text-ink-soft" dir="rtl">
        {club}
      </h2>
      <InfoBanner text={note} />
      <img src="/images/court-map.webp" alt={`نقشه ${club}`} className="w-full h-[203px] rounded-xl object-cover" />
      <button
        type="button"
        className="w-full bg-primary rounded-card px-4 py-3 text-sm font-bold leading-4 text-white active:opacity-90"
        dir="rtl"
      >
        مسیریابی
      </button>
    </section>
  );
}
