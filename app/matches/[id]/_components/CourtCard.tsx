import InfoBanner from "./InfoBanner";
import CourtMap from "./CourtMap";
import { PhoneIcon } from "./icons";
import { toPersianDigits } from "@/lib/persian";

interface Props {
  club: string;
  /** Optional: no API field behind it. */
  note?: string;
  lat?: number;
  lng?: number;
  /** `ClubResponse.logoUrl` — every seeded club has one. */
  logo?: string;
  /** `ClubResponse.contactPhone` — the club's line, for a player who is lost. */
  phone?: string;
}

/**
 * اطلاعات زمین card: club identity, notice banner, map, and routing button.
 *
 * The «ویرایش زمین» button that used to sit up here is gone: it never had an
 * `onClick`, and it never could — the API has no update-match endpoint at all,
 * so there is nothing for it to call.
 */
export default function CourtCard({ club, note, lat, lng, logo, phone }: Props) {
  return (
    <section className="w-full bg-white rounded-group p-3 flex flex-col items-center gap-2 shadow-card">
      <span className="w-full text-base text-muted text-right" dir="rtl">
        اطلاعات زمین
      </span>

      {/* LTR wrapper so items-end pins right; dir on the text only. */}
      <div className="w-full flex items-center justify-end gap-3">
        <h2 className="text-display font-bold text-ink-soft" dir="rtl">
          {club}
        </h2>
        {logo && (
          <img
            src={logo}
            alt=""
            className="size-12 shrink-0 rounded-full object-cover bg-edge"
          />
        )}
      </div>

      {note && <InfoBanner text={note} />}
      {lat !== undefined && lng !== undefined && <CourtMap lat={lat} lng={lng} label={club} />}

      {phone && (
        <a
          href={`tel:${phone}`}
          className="w-full min-h-11 flex items-center justify-center gap-2 rounded-group bg-surface text-sm font-bold text-ink-soft active:opacity-70"
          dir="rtl"
        >
          <PhoneIcon />
          تماس با باشگاه
          <span className="text-muted" dir="ltr">
            {toPersianDigits(phone)}
          </span>
        </a>
      )}
    </section>
  );
}

