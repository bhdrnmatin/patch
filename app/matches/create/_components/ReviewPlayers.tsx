"use client";

import { EditIcon } from "../../[id]/_components/icons";
import { toPersianDigits } from "../../../../lib/persian";

export interface ReviewRow {
  name: string;
  /** کاپیتان / یار */
  role: string;
  level?: number;
  avatar?: string;
}

interface Props {
  rows: ReviewRow[];
  /** Jump back to the players step. Omit to render the list read-only. */
  onEdit?: () => void;
}

/** اعضا card for the review step: player pills with a role tag on the left. */
export default function ReviewPlayers({ rows, onEdit }: Props) {
  return (
    <section className="w-full bg-white rounded-group p-3 flex flex-col gap-3 shadow-card">
      {onEdit ? (
        // LTR wrapper: justify-between puts the pencil left, the heading right.
        <button
          type="button"
          onClick={onEdit}
          aria-label="ویرایش بازیکنان"
          className="w-full h-11 flex items-center justify-between active:opacity-70"
        >
          <span className="size-8 flex items-center justify-center rounded-group bg-surface text-ink-soft">
            <EditIcon className="size-4" />
          </span>
          <h2 className="text-base font-bold text-ink" dir="rtl">
            اعضا
          </h2>
        </button>
      ) : (
        <h2 className="text-lg font-bold text-ink text-right" dir="rtl">
          اعضا
        </h2>
      )}
      <ul className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <li
            key={i}
            className="w-full bg-white border border-edge rounded-full p-2 flex items-center justify-end gap-3 shadow-card"
          >
            <span
              className="mr-auto shrink-0 text-xs font-bold bg-primary/10 text-primary rounded-full px-2.5 py-1"
              dir="rtl"
            >
              {row.role}
            </span>
            <span className="flex flex-col items-end gap-0.5 min-w-0 text-right">
              <span className="text-xs font-bold text-ink-soft truncate" dir="rtl">
                {row.name}
              </span>
              {row.level !== undefined && (
                <span className="text-xs text-muted" dir="rtl">
                  لول {toPersianDigits(String(row.level))}
                </span>
              )}
            </span>
            <img
              src={row.avatar ?? "/images/avatar-placeholder.svg"}
              alt=""
              className="size-10 shrink-0 rounded-full bg-edge object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
