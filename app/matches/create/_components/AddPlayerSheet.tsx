"use client";

import { useState } from "react";
import BottomSheet from "../../../(main)/matches/_components/BottomSheet";
import PlayerPickList from "../../[id]/results/_components/PlayerPickList";
import TextField from "./TextField";
import { isValidMobile, toLatinDigits, toPersianDigits } from "../../../../lib/persian";
import type { MatchPlayer } from "../../../../lib/types";

interface Props {
  open: boolean;
  slotLabel: string;
  /** The row's existing invite, if any — opens straight into the prefilled form
   *  so a mistyped number can be corrected instead of re-added. */
  invite?: { phone: string };
  players: MatchPlayer[];
  /** Player indexes already used by other rows — not selectable. */
  disabledPlayers: number[];
  /** Player index this row currently holds; tapping it clears the row. */
  selectedPlayer: number | null;
  onPickPlayer: (index: number) => void;
  onInvite: (phone: string) => void;
  /** Why this (valid, Latin) number can't be added, checked when the invite
   *  button is tapped — e.g. it's your own or another row's. */
  checkInvite: (phone: string) => string | undefined;
  /** Shown only when the row already holds someone, so it can be removed. */
  onClear?: () => void;
  onClose: () => void;
}

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
  checkInvite,
  onClear,
  onClose,
}: Props) {
  const [view, setView] = useState<"menu" | "phone" | "players">("menu");
  const [phone, setPhone] = useState("");
  // Set by tapping افزودن; cleared as soon as the number is edited.
  const [inviteError, setInviteError] = useState<string>();

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
      setPhone(invite ? toPersianDigits(invite.phone) : "");
      setInviteError(undefined);
    }
  }

  const latin = toLatinDigits(phone);
  const valid = isValidMobile(phone);

  return (
    <BottomSheet open={open} title={`افزودن ${slotLabel}`} onClose={onClose}>
      {view === "menu" ? (
        <div className="flex flex-col gap-2">
          <MenuRow
            title="از بین بازیکنان پچ"
            description="کسانی که قبلاً با آن‌ها بازی کرده‌اید"
            icon={<PeopleIcon />}
            onClick={() => setView("players")}
          />
          <MenuRow
            title="دعوت با شماره موبایل"
            description="یک پیامک دعوت برایش فرستاده می‌شود"
            icon={<PhoneIcon />}
            onClick={() => setView("phone")}
          />
          {onClear && <ClearButton onClick={onClear} />}
        </div>
      ) : view === "players" ? (
        <div className="flex flex-col gap-3">
          {/* The API suggests people you've played with, so a new organizer's
              list is legitimately empty — say so instead of showing nothing. */}
          {players.length === 0 ? (
            <p className="text-sm text-muted text-right leading-6" dir="rtl">
              هنوز کسی برای پیشنهاد نیست. با شماره موبایل دعوت کنید.
            </p>
          ) : (
            <PlayerPickList
              players={players}
              disabled={disabledPlayers}
              selected={selectedPlayer}
              onSelect={onPickPlayer}
            />
          )}
          {/* Re-tapping the picked player also clears the row, but nothing says
              so — the explicit button is how a row gets removed. */}
          {onClear && <ClearButton onClick={onClear} />}
          <BackButton className="w-full" onClick={() => setView("menu")} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <TextField
            label="شماره موبایل"
            value={phone}
            onChange={(v) => {
              setPhone(v);
              setInviteError(undefined);
            }}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            numeric
            error={phone && !valid ? "شماره باید ۱۱ رقم باشد و با ۰۹ شروع شود." : inviteError}
          />
          <p className="text-xs text-muted text-right leading-5" dir="rtl">
            دعوت پس از ثبت مچ پیامک می‌شود.
          </p>
          <div className="flex gap-3">
            <BackButton className="flex-1" onClick={() => setView("menu")} />
            <button
              type="button"
              disabled={!valid}
              onClick={() => {
                const error = checkInvite(latin);
                if (error) setInviteError(error);
                else onInvite(latin);
              }}
              className="flex-1 h-12 rounded-pill bg-primary text-sm font-bold text-white active:opacity-80 disabled:opacity-40"
              dir="rtl"
            >
              {invite ? "ذخیره" : "افزودن"}
            </button>
          </div>
          {/* An invited row opens straight on this form, never the menu — so
              without this here an added number had no way to be removed. */}
          {onClear && <ClearButton onClick={onClear} />}
        </div>
      )}
    </BottomSheet>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-12 rounded-card text-sm font-bold text-danger-deep active:opacity-80"
      dir="rtl"
    >
      حذف این بازیکن
    </button>
  );
}

/** Sizing is the caller's: `flex-1` to share a row, `w-full` to own a column.
 *  `shrink-0` either way — in a column it's the scroller that should give, not
 *  the button, which otherwise collapses to a sliver under a long list. */
function BackButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-12 shrink-0 rounded-pill border border-edge bg-white text-sm font-bold text-ink-soft active:opacity-80 ${className}`}
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
