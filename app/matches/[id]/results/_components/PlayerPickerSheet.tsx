"use client";

import BottomSheet from "../../../../(main)/matches/_components/BottomSheet";
import PlayerPickList from "./PlayerPickList";
import type { MatchPlayer } from "../../../../../lib/types";

interface Props {
  open: boolean;
  players: MatchPlayer[];
  /** Indexes already placed elsewhere in the game — not selectable. */
  disabled: number[];
  /** Index currently in the target slot; tapping it clears the slot. */
  selected: number | null;
  onSelect: (index: number) => void;
  onClose: () => void;
}

/** Player picker for a game slot: the match's players as tappable rows. */
export default function PlayerPickerSheet({
  open,
  players,
  disabled,
  selected,
  onSelect,
  onClose,
}: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} title="انتخاب بازیکن">
      <PlayerPickList players={players} disabled={disabled} selected={selected} onSelect={onSelect} />
    </BottomSheet>
  );
}
