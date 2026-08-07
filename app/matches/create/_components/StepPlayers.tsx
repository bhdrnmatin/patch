"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import TeamPreview from "./TeamPreview";
import PlayerPickerSheet from "../../[id]/results/_components/PlayerPickerSheet";
import type { CreateMatchDraft, MatchPlayer } from "../../../../lib/types";

const ROLE_OPTIONS: { id: "player" | "captain"; label: string }[] = [
  { id: "captain", label: "برگزار کننده (مربی)" },
  { id: "player", label: "بازیکن" },
];
/** Short form for the team preview / review tag. */
const roleShort = (r: CreateMatchDraft["myRole"]) =>
  r === "captain" ? "برگزار کننده" : r === "player" ? "بازیکن" : undefined;

const SLOT_LABELS = ["بازیکن ۲", "بازیکن ۳", "بازیکن ۴"] as const;

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
  players: MatchPlayer[];
}

/** Step ۴ بازیکنان: own role + three teammate slots (shared picker) + team preview. */
export default function StepPlayers({ draft, patch, players }: Props) {
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
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-ink-soft text-right" dir="rtl">
          نقش شما
        </span>
        <div className="flex gap-3" dir="rtl">
          {ROLE_OPTIONS.map((o) => {
            const selected = draft.myRole === o.id;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={selected}
                onClick={() => patch({ myRole: o.id })}
                className={`flex-1 min-h-12 px-2 py-2 rounded-card text-sm font-bold leading-tight border shadow-card active:opacity-80 ${
                  selected ? "bg-primary border-primary text-white" : "bg-white border-edge text-ink-soft"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
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
        myRoleLabel={roleShort(draft.myRole)}
        teammates={draft.teammates}
        players={players}
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
