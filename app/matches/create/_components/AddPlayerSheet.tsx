"use client";

import { useState } from "react";
import BottomSheet from "../../../(main)/matches/_components/BottomSheet";
import PlayerPickList from "../../[id]/results/_components/PlayerPickList";
import TextField from "./TextField";
import { toLatinDigits, toPersianDigits } from "../../../../lib/persian";
import type { MatchPlayer } from "../../../../lib/types";

interface Props {
  open: boolean;
  slotLabel: string;
  /** The row's existing invite, if any — opens straight into the prefilled form
   *  so a mistyped name or number can be corrected instead of re-added. */
  invite?: { name: string; phone: string };
  players: MatchPlayer[];
  /** Player indexes already used by other rows — not selectable. */
  disabledPlayers: number[];
  /** Player index this row currently holds; tapping it clears the row. */
  selectedPlayer: number | null;
  onPickPlayer: (index: number) => void;
  onInvite: (name: string, phone: string) => void;
  /** Shown only when the row already holds someone, so it can be removed. */
  onClear?: () => void;
  onClose: () => void;
}

const PHONE_RE = /^09\d{9}$/;

/**
 * How a teammate row gets filled: pick someone already on Patch, or invite a
 * phone number.
 *
 * All three views live in this one sheet on purpose. Handing off to a second
 * BottomSheet meant one sheet's cleanup ran `history.back()` while the other's
 * setup pushed a new entry, in the same commit — the picker wouldn't open on
 * the phone. One sheet, one history entry, no handoff.
 */
export default function AddPlayerSheet({
  open,
  slotLabel,
  invite,
  players,
  disabledPlayers,
  selectedPlayer,
  onPickPlayer,
  onInvite,
  onClear,
  onClose,
}: Props) {
  const [view, setView] = useState<"menu" | "phone" | "players">("menu");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Reset on each open, adjusting state during render rather than in an effect:
  // this component stays mounted (like every other sheet here) so that its
  // BottomSheet effect never runs at mount time, which is what made the sheet
  // flash open and shut.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      // Editing an existing row opens on the view that row came from; a new row
      // starts at the menu. TextField(numeric) displays Persian digits, so seed
      // the stored Latin number back into that notation.
      setView(invite ? "phone" : selectedPlayer !== null ? "players" : "menu");
      setName(invite?.name ?? "");
      setPhone(invite ? toPersianDigits(invite.phone) : "");
    }
  }

  const latin = toLatinDigits(phone);
  const phoneOk = PHONE_RE.test(latin);
  const trimmedName = name.trim();
  const valid = phoneOk && trimmedName.length > 0;

  return (
    <BottomSheet open={open} title={`افزودن ${slotLabel}`} onClose={onClose}>
      {view === "menu" ? (
        <div className="flex flex-col gap-2">
          <MenuRow
            title="از بین بازیکنان پچ"
            description="بازیکنانی که در پچ حساب دارند"
            icon={<PeopleIcon />}
            onClick={() => setView("players")}
          />
          <MenuRow
            title="دعوت با شماره موبایل"
            description="یک پیامک دعوت برایش فرستاده می‌شود"
            icon={<PhoneIcon />}
            onClick={() => setView("phone")}
          />
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="w-full h-12 rounded-card text-sm font-bold text-danger active:opacity-80"
              dir="rtl"
            >
              حذف این بازیکن
            </button>
          )}
        </div>
      ) : view === "players" ? (
        <div className="flex flex-col gap-3">
          <PlayerPickList
            players={players}
            disabled={disabledPlayers}
            selected={selectedPlayer}
            onSelect={onPickPlayer}
          />
          <BackButton onClick={() => setView("menu")} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <TextField label="نام" value={name} onChange={setName} placeholder="مثلا رضا محمدی" />
          <TextField
            label="شماره موبایل"
            value={phone}
            onChange={setPhone}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            numeric
          />
          <p className="text-xs text-muted text-right leading-5" dir="rtl">
            {phone && !phoneOk
              ? "شماره باید ۱۱ رقم باشد و با ۰۹ شروع شود."
              : "نام برای نمایش در فهرست بازیکنان است؛ دعوت پس از ثبت مچ پیامک می‌شود."}
          </p>
          <div className="flex gap-3">
            <BackButton onClick={() => setView("menu")} />
            <button
              type="button"
              disabled={!valid}
              onClick={() => onInvite(trimmedName, latin)}
              className="flex-1 h-12 rounded-pill bg-primary text-sm font-bold text-white active:opacity-80 disabled:opacity-40"
              dir="rtl"
            >
              {invite ? "ذخیره" : "افزودن"}
            </button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 h-12 rounded-pill border border-edge bg-white text-sm font-bold text-ink-soft active:opacity-80"
      dir="rtl"
    >
      بازگشت
    </button>
  );
}

function MenuRow({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-group p-4 bg-white border border-edge shadow-card active:opacity-90"
    >
      <span className="flex-1 min-w-0 flex flex-col items-end gap-0.5">
        <span className="text-sm font-bold text-ink" dir="rtl">
          {title}
        </span>
        <span className="text-xs text-muted leading-5 text-right" dir="rtl">
          {description}
        </span>
      </span>
      <span className="shrink-0 text-ink-soft">{icon}</span>
    </button>
  );
}

function PeopleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 5.5a3 3 0 0 1 0 5M17 19a5.5 5.5 0 0 0-2.8-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
