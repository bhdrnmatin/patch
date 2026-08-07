"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import RadioCardGroup, { type RadioCardOption } from "./RadioCardGroup";
import TeamPreview from "./TeamPreview";
import PlayerPickerSheet from "../../[id]/results/_components/PlayerPickerSheet";
import type { CreateMatchDraft, MatchPlayer } from "../../../../lib/types";

const ROLE_OPTIONS: RadioCardOption[] = [
  {
    id: "captain",
    title: "برگزار کننده (مربی)",
    description: "مسئول برگزاری و مدیریت مسابقه",
    icon: <WhistleIcon />,
  },
  {
    id: "player",
    title: "بازیکن",
    description: "یکی از بازیکنان حاضر در زمین",
    icon: <PlayerIcon />,
  },
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
      <RadioCardGroup
        label="نقش شما"
        subtitle="نقش شما در این مسابقه چیست؟"
        options={ROLE_OPTIONS}
        value={draft.myRole}
        onChange={(id) => patch({ myRole: id as CreateMatchDraft["myRole"] })}
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

// Stroked 26px icons matching the step ۱ radio cards (StepDetails defines its
// own the same way) rather than the filled BottomNav set.
function WhistleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="14" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 11.6h6.4a1.6 1.6 0 0 0 0-3.2h-8.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.2 8.4 10.6 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlayerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
