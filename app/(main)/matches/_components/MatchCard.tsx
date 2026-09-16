import Link from "next/link";
import type { MatchListItem } from "@/lib/types";
import { toPersianDigits } from "@/lib/persian";
import StatusBadge from "./StatusBadge";
import PlayerSlot from "./PlayerSlot";
import MetaItem from "./MetaItem";
import PriceTag from "./PriceTag";
import { ChartIcon, PeopleIcon, CalendarIcon, PinIcon, ChevronLeftIcon } from "../../_components/icons";

/**
 * Match card: title + status, the roster grid, one meta row, and the CTA
 * through to the match.
 *
 * A compact version (2026-09-16) swapped the roster for an organizer avatar and
 * byline; the user brought the player cards back the same day. No organizer row
 * now — the organizer is almost always in the roster, so it would show twice.
 */
export default function MatchCard({ match }: { match: MatchListItem }) {
  const { id, title, status, players, club, avgLevel, capacity, date, price } = match;

  return (
    <article className="bg-white rounded-group p-3 flex flex-col gap-3 shadow-pop">
      {/* Title row. LTR wrapper so the badge pins left; dir="rtl" only on the
          title (CLAUDE.md flex trap). */}
      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        <h3 dir="rtl" className="flex-1 min-w-0 text-base font-bold text-ink text-right truncate">
          {title}
        </h3>
      </div>

      {/* Roster grid. `dir="rtl"` reverses the inline axis, which is what an RTL
          roster needs: without it the grid fills from the left, so a lone player
          sits in the wrong column and a pair reads back-to-front. `PlayerSlot`
          pins its own direction, so it is unaffected by the flip. */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2" dir="rtl">
        {players.map((p, i) => (
          <PlayerSlot key={i} name={p.name} level={p.level} avatar={p.avatar} />
        ))}
      </div>

      {/* Centred over the CTA (user). RTL so the items read place → date →
          players from the right; justify-center is unaffected by the flip. */}
      <div className="flex items-center justify-center gap-3 flex-wrap" dir="rtl">
        {club && <MetaItem icon={<PinIcon />} label={club} />}
        <MetaItem icon={<CalendarIcon />} label={date} />
        <MetaItem icon={<PeopleIcon />} label={`${toPersianDigits(String(capacity))} نفر`} />
        {/* Levels arrive after the MVP, so a live match has none to average.
            Shown only when actually known — «میانگین لول: ۰» would be a lie. */}
        {avgLevel !== undefined && (
          <MetaItem icon={<ChartIcon />} label={`میانگین لول: ${toPersianDigits(String(avgLevel))}`} />
        )}
      </div>

      {/* The way into the match. Shows the price when there is one; the API has
          no price field until after the MVP, so until then it reads as a plain
          invitation rather than claiming the match is free. */}
      <Link
        href={`/matches/${id}`}
        className="h-11 w-full rounded-pill bg-primary hover:bg-primary-hover active:opacity-80 flex items-center justify-center gap-1.5 text-white font-bold text-sm"
        dir="rtl"
      >
        {price !== undefined ? <PriceTag amount={price} /> : "مشاهده مچ"}
        <ChevronLeftIcon />
      </Link>
    </article>
  );
}
