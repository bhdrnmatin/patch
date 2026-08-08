"use client";

import { CheckIcon } from "../../_components/icons";
import { toPersianDigits } from "../../../../../lib/persian";
import type { MatchPlayer } from "../../../../../lib/types";

interface Props {
  players: MatchPlayer[];
  /** Indexes already placed elsewhere — not selectable. */
  disabled: number[];
  /** Index currently in the target slot; tapping it clears the slot. */
  selected: number | null;
  onSelect: (index: number) => void;
}

/**
 * Tappable player rows. Split out of PlayerPickerSheet so it can also render as
 * a view inside another sheet — chaining two BottomSheets meant one tore down
 * its history entry while the other pushed, in the same commit.
 */
export default function PlayerPickList({ players, disabled, selected, onSelect }: Props) {
  return (
    <ul className="flex flex-col gap-2">
      {players.map((player, index) => {
        const isSelected = selected === index;
        return (
          <li key={index}>
            <button
              type="button"
              disabled={disabled.includes(index)}
              aria-pressed={isSelected}
              onClick={() => onSelect(index)}
              className={`w-full bg-white rounded-full p-2 flex items-center justify-end gap-3 shadow-card border active:opacity-80 disabled:opacity-40 ${
                isSelected ? "border-primary" : "border-white/15"
              }`}
            >
              {isSelected && <CheckIcon className="size-4 shrink-0 text-primary mr-auto" />}
              <span className="flex flex-col items-end gap-0.5 min-w-0 text-right">
                <span className="text-xs font-bold text-ink-soft" dir="rtl">
                  {player.name}
                </span>
                <span className="text-xs text-muted" dir="rtl">
                  لول {toPersianDigits(String(player.level))}
                </span>
              </span>
              <img
                src={player.avatar ?? "/images/avatar-placeholder.svg"}
                alt=""
                className="size-10 shrink-0 rounded-full bg-edge object-cover"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
