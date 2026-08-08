"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import RadioCardGroup, { type RadioCardOption } from "./RadioCardGroup";
import AddPlayerSheet, { formatPhone } from "./AddPlayerSheet";
import TeamPreview from "./TeamPreview";
import PlayerPickerSheet from "../../[id]/results/_components/PlayerPickerSheet";
import type { CreateMatchDraft, MatchPlayer, TeammateSlot } from "../../../../lib/types";

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
  // Which slot is being edited, and which sheet is on top of it.
  const [activeSlot, setActiveSlot] = useState<0 | 1 | 2 | null>(null);
  const [sheet, setSheet] = useState<"add" | "players" | null>(null);

  const setSlot = (slot: 0 | 1 | 2, value: TeammateSlot) => {
    const teammates = [...draft.teammates] as CreateMatchDraft["teammates"];
    teammates[slot] = value;
    patch({ teammates });
  };

  const openSlot = (slot: 0 | 1 | 2) => {
    setActiveSlot(slot);
    setSheet("add");
  };
  const closeSheets = () => {
    setActiveSlot(null);
    setSheet(null);
  };

  const current = activeSlot === null ? null : draft.teammates[activeSlot];
  const firstEmpty = draft.teammates.findIndex((t) => t === null) as -1 | 0 | 1 | 2;

  // The picker works in player indexes, so only player-kind slots map onto it.
  const pickerSelected = current?.kind === "player" ? current.index : null;
  const pickerDisabled = draft.teammates
    .filter((t) => t?.kind === "player")
    .map((t) => (t as { kind: "player"; index: number }).index)
    .filter((i) => i !== pickerSelected);

  const slotValue = (t: TeammateSlot) => {
    if (t === null) return undefined;
    return t.kind === "player" ? players[t.index]?.name : `دعوت ${formatPhone(t.phone)}`;
  };

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
        return (
          <SelectField
            key={label}
            label={label}
            value={slotValue(draft.teammates[slot])}
            placeholder="افزودن بازیکن"
            onClick={() => openSlot(slot)}
          />
        );
      })}
      {firstEmpty !== -1 && (
        <button
          type="button"
          onClick={() => openSlot(firstEmpty)}
          className="w-full h-12 rounded-pill border-2 border-dashed border-primary/40 text-primary text-sm font-bold active:opacity-80"
          dir="rtl"
        >
          + اضافه کردن بازیکن
        </button>
      )}
      <p className="text-xs text-muted text-right leading-5" dir="rtl">
        جایگاه‌های خالی را می‌توانید بعد از ثبت مچ با لینک دعوت پر کنید — لینک در صفحه‌ی مچ است.
      </p>
      <TeamPreview
        myRoleLabel={roleShort(draft.myRole)}
        teammates={draft.teammates}
        players={players}
      />

      {sheet === "add" && activeSlot !== null && (
        <AddPlayerSheet
          slotLabel={SLOT_LABELS[activeSlot]}
          onClear={
            current
              ? () => {
                  setSlot(activeSlot, null);
                  closeSheets();
                }
              : undefined
          }
          onPickFromPlayers={() => setSheet("players")}
          onInvite={(phone) => {
            setSlot(activeSlot, { kind: "invite", phone });
            closeSheets();
          }}
          onClose={closeSheets}
        />
      )}

      <PlayerPickerSheet
        open={sheet === "players"}
        players={players}
        disabled={pickerDisabled}
        selected={pickerSelected}
        onSelect={(playerIndex) => {
          if (activeSlot !== null) {
            // Tapping the slot's current player clears it (PlayerPickerSheet contract).
            setSlot(activeSlot, pickerSelected === playerIndex ? null : { kind: "player", index: playerIndex });
          }
          closeSheets();
        }}
        onClose={closeSheets}
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
