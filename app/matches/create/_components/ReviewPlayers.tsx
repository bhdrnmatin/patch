"use client";

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
}

/** اعضا card for the review step: player pills with a role tag on the left. */
export default function ReviewPlayers({ rows }: Props) {
  return (
    <section className="w-full bg-white rounded-group p-3 flex flex-col gap-3 shadow-card">
      <h2 className="text-lg font-bold text-ink text-right" dir="rtl">
        اعضا
      </h2>
      <ul className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <li
            key={i}
            className="w-full bg-white border border-edge rounded-full p-2 flex items-center justify-end gap-3 shadow-card"
          >
            <span
              className="mr-auto shrink-0 text-xs font-semibold bg-primary/10 text-primary rounded-full px-2.5 py-1"
              dir="rtl"
            >
              {row.role}
            </span>
            <span className="flex flex-col items-end gap-0.5 min-w-0 text-right">
              <span className="text-xs font-semibold text-ink-soft truncate" dir="rtl">
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
