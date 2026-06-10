import { toPersianDigits } from "../../../../lib/persian";
import type { MatchPlayer } from "../../../../lib/types";

interface Props {
  player: MatchPlayer;
}

/** White card chip: avatar on the right, name + level on the left (RTL). */
export default function PlayerChip({ player }: Props) {
  return (
    <div className="bg-white border border-white/15 rounded-2xl pl-3 pr-2 py-2 flex items-center justify-end gap-2 drop-shadow-[0px_2px_1.5px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col items-end gap-2 min-w-0">
        <span className="text-xs font-semibold leading-[11px] text-ink-soft truncate" dir="rtl">
          {player.name}
        </span>
        <span className="text-xs leading-[11px] text-ink-soft/50" dir="rtl">
          لول {toPersianDigits(String(player.level))}
        </span>
      </div>
      <img
        src={player.avatar ?? "/images/avatar-placeholder.svg"}
        alt=""
        className="size-10 shrink-0 rounded-full bg-edge object-cover"
      />
    </div>
  );
}
