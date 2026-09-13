import PlayerChip from "./PlayerChip";
import { ChevronLeftIcon } from "./icons";
import type { MatchPlayer } from "../../../../lib/types";

interface Props {
  players: MatchPlayer[];
}

/** بازیکنان header + "همه" link + 2-column grid of player chips. */
export default function PlayersSection({ players }: Props) {
  return (
    <section className="w-full flex flex-col gap-3">
      <div className="w-full flex items-center justify-between">
        <button type="button" className="flex items-center text-xs font-bold text-ink-soft active:opacity-70">
          <ChevronLeftIcon className="size-5" />
          همه
        </button>
        <h2 className="text-base font-bold leading-4 text-ink-soft" dir="rtl">
          بازیکنان
        </h2>
      </div>
      {/* `dir="rtl"` reverses the inline axis so each row fills from the right.
          With an odd roster the last chip then sits in the right column with the
          gap on its left, instead of starting a row on the wrong side.
          `PlayerChip` pins `dir="ltr"` so its own alignment is unaffected. */}
      <ul className="grid grid-cols-2 gap-3" dir="rtl">
        {players.map((p, i) => (
          <li key={i}>
            <PlayerChip player={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
