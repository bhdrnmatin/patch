import Link from "next/link";
import type { MatchListItem } from "@/lib/types";
import { toPersianDigits } from "@/lib/persian";
import StatusBadge from "./StatusBadge";
import PlayerSlot from "./PlayerSlot";
import MetaItem from "./MetaItem";
import PriceTag from "./PriceTag";
import { ChartIcon, PeopleIcon, CalendarIcon } from "../../_components/icons";

/** Full match card: status + title, 2×3 roster grid, meta row, and the CTA
 *  through to the match. */
export default function MatchCard({ match }: { match: MatchListItem }) {
  const { id, title, status, players, avgLevel, capacity, date, price } = match;

  return (
    <article className="bg-white rounded-card p-3 flex flex-col gap-4 shadow-pop">
      {/* Top row: status badge (left) + title (right) */}
      <div className="flex items-center justify-between" dir="rtl">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <StatusBadge status={status} />
      </div>

      {/* Roster grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {players.map((p, i) => (
          <PlayerSlot key={i} name={p.name} level={p.level} avatar={p.avatar} />
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-center gap-3" dir="rtl">
        <MetaItem icon={<CalendarIcon />} label={date} />
        <span className="w-px h-4 bg-divider" />
        <MetaItem icon={<PeopleIcon />} label={`${toPersianDigits(String(capacity))} نفر`} />
        {/* Levels arrive after the MVP, so a live match has none to average.
            Shown only when actually known — «میانگین لول: ۰» would be a lie. */}
        {avgLevel !== undefined && (
          <>
            <span className="w-px h-4 bg-divider" />
            <MetaItem icon={<ChartIcon />} label={`میانگین لول: ${toPersianDigits(String(avgLevel))}`} />
          </>
        )}
      </div>

      {/* The way into the match. This was a dead <button> and the list had no
          route to the details page at all, so the card was a leaf.
          It shows the price when there is one; the API has no price field until
          after the MVP, and until then the CTA reads as a plain invitation
          rather than claiming the match is free. */}
      <Link
        href={`/matches/${id}`}
        className="h-10 w-full rounded-pill bg-primary hover:bg-primary-hover active:opacity-80 flex items-center justify-center text-white font-bold text-sm"
        dir="rtl"
      >
        {price !== undefined ? <PriceTag amount={price} /> : "مشاهده مچ"}
      </Link>
    </article>
  );
}
