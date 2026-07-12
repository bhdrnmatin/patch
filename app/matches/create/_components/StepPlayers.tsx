"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import OptionSheet, { type SheetOption } from "./OptionSheet";
import TeamPreview from "./TeamPreview";
import PlayerPickerSheet from "../../[id]/results/_components/PlayerPickerSheet";
import type { CreateMatchDraft, MatchPlayer } from "../../../../lib/types";

export const ROLE_OPTIONS: SheetOption[] = [
  { id: "captain", label: "کاپیتان" },
  { id: "player", label: "بازیکن" },
];

const SLOT_LABELS = ["بازیکن ۲", "بازیکن ۳", "بازیکن ۴"] as const;

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
  players: MatchPlayer[];
}

/** Step ۴ بازیکنان: own role + three teammate slots (shared picker) + team preview. */
export default function StepPlayers({ draft, patch, players }: Props) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<0 | 1 | 2 | null>(null);

  const setSlot = (slot: 0 | 1 | 2, playerIndex: number) => {
    const teammates = [...draft.teammates] as CreateMatchDraft["teammates"];
    // Tapping the slot's current player clears it (PlayerPickerSheet contract).
    teammates[slot] = teammates[slot] === playerIndex ? null : playerIndex;
    patch({ teammates });
  };

  const firstEmpty = draft.teammates.findIndex((t) => t === null) as -1 | 0 | 1 | 2;
  const pickerSelected = activeSlot === null ? null : draft.teammates[activeSlot];
  const pickerDisabled =
    activeSlot === null
      ? []
      : draft.teammates.filter((t): t is number => t !== null && t !== pickerSelected);

  return (
    <>
      <SelectField
        label="نقش شما"
        value={ROLE_OPTIONS.find((o) => o.id === draft.myRole)?.label}
        onClick={() => setRoleOpen(true)}
      />
      {SLOT_LABELS.map((label, i) => {
        const slot = i as 0 | 1 | 2;
        const index = draft.teammates[slot];
        return (
          <SelectField
            key={label}
            label={label}
            value={index === null ? undefined : players[index]?.name}
            placeholder="انتخاب بازیکن"
            onClick={() => setActiveSlot(slot)}
          />
        );
      })}
      {firstEmpty !== -1 && (
        <button
          type="button"
          onClick={() => setActiveSlot(firstEmpty)}
          className="w-full h-12 rounded-pill border-2 border-dashed border-primary/40 text-primary text-sm font-bold active:opacity-80"
          dir="rtl"
        >
          + اضافه کردن بازیکن
        </button>
      )}
      <TeamPreview
        myRoleLabel={ROLE_OPTIONS.find((o) => o.id === draft.myRole)?.label}
        teammates={draft.teammates}
        players={players}
      />

      <OptionSheet
        open={roleOpen}
        title="نقش شما"
        options={ROLE_OPTIONS}
        value={draft.myRole}
        onSelect={(id) => {
          patch({ myRole: id as CreateMatchDraft["myRole"] });
          setRoleOpen(false);
        }}
        onClose={() => setRoleOpen(false)}
      />
      <PlayerPickerSheet
        open={activeSlot !== null}
        players={players}
        disabled={pickerDisabled}
        selected={pickerSelected}
        onSelect={(playerIndex) => {
          if (activeSlot !== null) setSlot(activeSlot, playerIndex);
          setActiveSlot(null);
        }}
        onClose={() => setActiveSlot(null)}
      />
    </>
  );
}
