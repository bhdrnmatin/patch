"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import RadioCardGroup, { type RadioCardOption } from "./RadioCardGroup";
import AddPlayerSheet from "./AddPlayerSheet";
import OptionSheet from "./OptionSheet";
import TeamPreview from "./TeamPreview";
import PlayerPickerSheet from "../../[id]/results/_components/PlayerPickerSheet";
import { toPersianDigits } from "../../../../lib/persian";
import { MAX_TEAMMATES, type CreateMatchDraft, type MatchPlayer, type Teammate } from "../../../../lib/types";

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


interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
  players: MatchPlayer[];
}

/** Step ۴ بازیکنان: own role + three teammate slots (shared picker) + team preview. */
export default function StepPlayers({ draft, patch, players }: Props) {
  // Which row is being edited (=== teammates.length means "adding a new one"),
  // and which sheet is on top of it.
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [sheet, setSheet] = useState<"add" | "players" | "coach" | null>(null);

  // رقابتی is 2v2 padel — the creator plus three. دوستانه and آمریکانو (rotating
  // partners) have no fixed team shape, so they're uncapped.
  const capped = draft.format === "competitive";
  const canAdd = !capped || draft.teammates.length < MAX_TEAMMATES;

  const setRow = (row: number, value: Teammate) => {
    const teammates = [...draft.teammates];
    teammates[row] = value; // row === length appends
    patch({ teammates });
  };

  const removeRow = (row: number) => {
    // The coach is stored as a row index, so it has to follow the shift.
    const coach =
      draft.coach === null || draft.coach === row
        ? null
        : draft.coach > row
          ? draft.coach - 1
          : draft.coach;
    patch({ teammates: draft.teammates.filter((_, i) => i !== row), coach });
  };

  const openRow = (row: number) => {
    setActiveRow(row);
    setSheet("add");
  };
  const closeSheets = () => {
    setActiveRow(null);
    setSheet(null);
  };

  const current = activeRow === null ? undefined : draft.teammates[activeRow];

  // The picker works in player indexes, so only player-kind rows map onto it.
  const pickerSelected = current?.kind === "player" ? current.index : null;
  const pickerDisabled = draft.teammates
    .filter((t) => t.kind === "player")
    .map((t) => (t as { kind: "player"; index: number }).index)
    .filter((i) => i !== pickerSelected);

  const rowLabel = (row: number) => `بازیکن ${toPersianDigits(String(row + 2))}`;
  const rowValue = (t: Teammate) =>
    t.kind === "player" ? players[t.index]?.name : `${t.name} (${toPersianDigits(t.phone)})`;

  return (
    <>
      <RadioCardGroup
        label="نقش شما"
        subtitle="نقش شما در این مسابقه چیست؟"
        options={ROLE_OPTIONS}
        value={draft.myRole}
        onChange={(id) => {
          const myRole = id as CreateMatchDraft["myRole"];
          // A برگزار کننده creator is the coach, so no teammate can hold it.
          patch(myRole === "captain" ? { myRole, coach: null } : { myRole });
        }}
      />
      {/* One row per added teammate; the dashed button below is the only way in. */}
      {draft.teammates.map((t, i) => (
        <SelectField key={i} label={rowLabel(i)} value={rowValue(t)} onClick={() => openRow(i)} />
      ))}
      {canAdd && (
        <button
          type="button"
          onClick={() => openRow(draft.teammates.length)}
          className="w-full h-12 rounded-pill border-2 border-dashed border-primary/40 text-primary text-sm font-bold active:opacity-80"
          dir="rtl"
        >
          + اضافه کردن بازیکن
        </button>
      )}
      {/* The creator plays, so the برگزار کننده role is open — let them hand it
          to one of the people they added. Optional: a match can have no coach. */}
      {draft.myRole === "player" && (
        <SelectField
          label="مربی (اختیاری)"
          value={draft.coach === null ? undefined : rowValue(draft.teammates[draft.coach])}
          placeholder={
            draft.teammates.length === 0 ? "اول بازیکن اضافه کنید" : "یکی از بازیکنان را انتخاب کنید"
          }
          disabled={draft.teammates.length === 0}
          onClick={() => setSheet("coach")}
        />
      )}
      <p className="text-xs text-muted text-right leading-5" dir="rtl">
        {capped
          ? "مچ رقابتی ۲ به ۲ است — با خودتان ۴ بازیکن. جای خالی را بعد از ثبت مچ با لینک دعوت پر کنید."
          : "برای این نوع مچ محدودیتی در تعداد بازیکنان نیست. بقیه را بعد از ثبت مچ با لینک دعوت اضافه کنید."}
      </p>
      {/* The 2×2 court only describes a رقابتی match; آمریکانو rotates partners
          and دوستانه has no fixed shape, so the row list above stands alone. */}
      {capped && (
        <TeamPreview
          myRoleLabel={roleShort(draft.myRole)}
          teammates={draft.teammates}
          players={players}
        />
      )}

      <AddPlayerSheet
        open={sheet === "add"}
        slotLabel={activeRow === null ? "بازیکن" : rowLabel(activeRow)}
        invite={current?.kind === "invite" ? current : undefined}
        onClear={
          current
            ? () => {
                if (activeRow !== null) removeRow(activeRow);
                closeSheets();
              }
            : undefined
        }
        onPickFromPlayers={() => setSheet("players")}
        onInvite={(name, phone) => {
          if (activeRow !== null) setRow(activeRow, { kind: "invite", name, phone });
          closeSheets();
        }}
        onClose={closeSheets}
      />

      <PlayerPickerSheet
        open={sheet === "players"}
        players={players}
        disabled={pickerDisabled}
        selected={pickerSelected}
        onSelect={(playerIndex) => {
          if (activeRow !== null) {
            // Tapping the row's current player removes it (PlayerPickerSheet contract).
            if (pickerSelected === playerIndex) removeRow(activeRow);
            else setRow(activeRow, { kind: "player", index: playerIndex });
          }
          closeSheets();
        }}
        onClose={closeSheets}
      />

      <OptionSheet
        open={sheet === "coach"}
        title="انتخاب مربی"
        options={draft.teammates.map((t, i) => ({ id: String(i), label: rowValue(t) ?? rowLabel(i) }))}
        value={draft.coach === null ? null : String(draft.coach)}
        onSelect={(id) => {
          // Re-picking the current coach clears it — the only way back to "no coach".
          const picked = Number(id);
          patch({ coach: draft.coach === picked ? null : picked });
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
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
