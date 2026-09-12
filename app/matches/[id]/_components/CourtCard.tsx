import InfoBanner from "./InfoBanner";
import CourtMap from "./CourtMap";
import { EditIcon } from "./icons";

interface Props {
  club: string;
  note: string;
  lat?: number;
  lng?: number;
}

/** اطلاعات زمین card: club name, notice banner, map, and routing button. */
export default function CourtCard({ club, note, lat, lng }: Props) {
  return (
    <section className="w-full bg-white rounded-group p-3 flex flex-col items-center gap-2 shadow-card">
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          aria-label="ویرایش زمین"
          className="p-2 rounded-group bg-surface text-ink-soft active:opacity-70"
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
      {lat !== undefined && lng !== undefined && (
        <CourtMap lat={lat} lng={lng} label={club} />
      )}
    </section>
  );
}
