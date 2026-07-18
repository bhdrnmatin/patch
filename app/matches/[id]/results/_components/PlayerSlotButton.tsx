"use client";

import { toPersianDigits } from "../../../../../lib/persian";
import type { MatchPlayer } from "../../../../../lib/types";

interface Props {
  /** Omitted → empty slot (dashed افزودن بازیکن state). */
  player?: MatchPlayer;
  /** Slot context for a11y, e.g. "تیم ۱، بازی ۲" — disambiguates repeated slots. */
  slotLabel: string;
  onClick: () => void;
}

/** One player slot in a game: filled chip (avatar + name + level) or dashed empty state. */
export default function PlayerSlotButton({ player, slotLabel, onClick }: Props) {
  if (!player) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`افزودن بازیکن به ${slotLabel}`}
        className="w-full h-14 rounded-2xl border-2 border-dashed border-edge flex items-center justify-center text-xs font-bold text-muted active:opacity-80"
        dir="rtl"
      >
        + افزودن بازیکن
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`تغییر بازیکن ${player.name} در ${slotLabel}`}
      className="w-full h-14 rounded-2xl bg-surface border border-edge px-2 flex items-center justify-end gap-2 active:opacity-80"
    >
      <span className="flex flex-col items-end gap-1 min-w-0 text-right">
        <span className="w-full text-xs font-bold leading-[11px] text-ink-soft truncate" dir="rtl">
          {player.name}
        </span>
        <span className="text-xs leading-[11px] text-muted" dir="rtl">
          لول {toPersianDigits(String(player.level))}
        </span>
      </span>
      <img
        src={player.avatar ?? "/images/avatar-placeholder.svg"}
        alt=""
        className="size-10 shrink-0 rounded-full bg-edge object-cover"
      />
    </button>
  );
}
