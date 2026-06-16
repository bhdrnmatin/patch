import type { TournamentListItem } from "@/lib/types";
import PriceTag from "../../matches/_components/PriceTag";
import TournamentPoster from "./TournamentPoster";
import InfoPair from "./InfoPair";

/** Full tournament card: poster + title + two-column info grid + details CTA. */
export default function TournamentCard({ tournament }: { tournament: TournamentListItem }) {
  const { title, status, poster, teams, prize, startDate, level, organizer, entryFee } = tournament;
  const price = (amount: number) => <PriceTag amount={amount} className="text-xs font-bold text-ink-soft" />;

  return (
    <article className="flex flex-col items-center gap-3 rounded-group border border-edge bg-white p-2">
      <TournamentPoster poster={poster} status={status} />

      {/* Title — wrapper stays LTR so `justify-end` pins it to the right */}
      <div className="flex w-full justify-end px-4">
        <h3 dir="rtl" className="text-lg font-bold text-ink-soft">{title}</h3>
      </div>

      {/* Two-column info grid. Container stays LTR so `items-end` right-aligns
          each column's rows (matching Figma); each InfoPair handles its own RTL. */}
      <div className="flex w-full items-start justify-between rounded-2xl bg-surface px-3 py-2">
        <div className="flex flex-col items-end gap-3">
          <InfoPair label="تعداد تیم:" value={teams} />
          <InfoPair label="جایزه:" value={price(prize)} />
          <InfoPair label="شروع:" value={startDate} />
        </div>
        <div className="flex flex-col items-end gap-3">
          <InfoPair label="سطح:" value={level} />
          <InfoPair label="برگذار کننده:" value={organizer} />
          <InfoPair label="ورودی:" value={price(entryFee)} />
        </div>
      </div>

      {/* Details CTA */}
      <button
        type="button"
        className="h-10 w-full rounded-pill border-[1.5px] border-white/15 bg-primary text-sm font-bold text-white hover:bg-primary-hover active:opacity-80"
      >
        جزئیات تورنومنت
      </button>
    </article>
  );
}
