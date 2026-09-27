import Link from "next/link";
import type { MatchListItem } from "@/lib/types";
import { tehranClock } from "@/lib/api/matches";
import { addDaysISO, todayISO } from "@/lib/jalali";
import StatusBadge from "./StatusBadge";
import PriceTag from "./PriceTag";
import CourtLineup from "../../_components/CourtLineup";
import { ChevronLeftIcon, PinIcon } from "../../_components/icons";

/** «امروز» and «فردا» read faster than a date for the two days that matter most. */
function dayLabel(day: string, date: string): string {
  const today = todayISO();
  if (day === today) return "امروز";
  if (day === addDaysISO(today, 1)) return "فردا";
  return date;
}

/**
 * Match card, read like a fixture: kick-off time, what and where, then the
 * court itself with who's on it — the empty seats are what a player scans for.
 *
 * The roster stays on the card (user, 2026-09-16: a compact card without it
 * was rejected); it's drawn as the court now instead of a grid of name chips.
 */
export default function MatchCard({ match }: { match: MatchListItem }) {
  const { id, title, status, players, club, capacity, date, day, startMs, price } = match;

  return (
    <article className="bg-white rounded-[28px] p-2 pt-4 flex flex-col gap-3 shadow-float">
      {/* LTR row so the badge pins left and the time right (CLAUDE.md flex
          trap); dir="rtl" sits on the text. */}
      <div className="flex items-center gap-3 px-2">
        <StatusBadge status={status} />
        <div className="flex-1 min-w-0 flex flex-col items-end gap-1 text-right">
          <h3 dir="rtl" className="max-w-full truncate text-base font-bold leading-5 text-ink">
            {title}
          </h3>
          {club && (
            <p dir="rtl" className="max-w-full flex items-center gap-1 text-xs leading-4 text-muted">
              <PinIcon className="size-3.5 shrink-0" />
              <span className="truncate">{club}</span>
            </p>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-center border-l border-divider pl-3">
          <span className="font-display text-[30px] leading-[1.1] text-ink">{tehranClock(startMs)}</span>
          <span dir="rtl" className="text-[11px] leading-none text-muted">
            {dayLabel(day, date)}
          </span>
        </div>
      </div>

      <CourtLineup players={players} capacity={capacity} open={status === "active"} />

      <Link
        href={`/matches/${id}`}
        className="h-12 w-full rounded-[20px] bg-primary hover:bg-primary-hover active:opacity-80 flex items-center justify-center gap-1.5 text-white font-bold text-sm"
        dir="rtl"
      >
        {price !== undefined ? <PriceTag amount={price} /> : "مشاهده مَچ"}
        <ChevronLeftIcon />
      </Link>
    </article>
  );
}
