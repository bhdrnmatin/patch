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
        <button type="button" className="flex items-center text-xs font-semibold text-ink-soft active:opacity-70">
          <ChevronLeftIcon className="size-5" />
          همه
        </button>
        <h2 className="text-base font-semibold leading-4 text-ink-soft" dir="rtl">
          بازیکنان
        </h2>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {players.map((p, i) => (
          <li key={i}>
            <PlayerChip player={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
