import { toPersianDigits } from "../../../../lib/persian";
import type { MatchPlayer } from "../../../../lib/types";

interface Props {
  player: MatchPlayer;
}

/**
 * White card chip: avatar on the right, name + level on the left (RTL).
 *
 * `dir="ltr"` is pinned on purpose. The chip sits in an `dir="rtl"` grid so the
 * roster fills right-to-left, and that direction is inherited — which would flip
 * `justify-end` to the left and swap the avatar to the wrong side. The grid
 * needs RTL for its column order; this box needs LTR for its alignment
 * utilities. Both are true at once, hence the pin.
 */
export default function PlayerChip({ player }: Props) {
  return (
    <div
      dir="ltr"
      className="bg-white border border-white/15 rounded-2xl pl-3 pr-2 py-2 flex items-center justify-end gap-2 shadow-card"
    >
      <div className="flex flex-col items-end gap-2 min-w-0">
        <span className="text-xs font-bold leading-[11px] text-ink-soft truncate" dir="rtl">
          {player.name}
        </span>
        {/* Levels arrive after the MVP, so an API player has none — printing
            «لول undefined» is what an unguarded String() would give. */}
        {player.level !== undefined && (
          <span className="text-xs leading-[11px] text-ink-soft/50" dir="rtl">
            لول {toPersianDigits(String(player.level))}
          </span>
        )}
      </div>
      <img
        src={player.avatar ?? "/images/avatar-placeholder.svg"}
        alt=""
        className="size-10 shrink-0 rounded-full bg-edge object-cover"
      />
    </div>
  );
}
