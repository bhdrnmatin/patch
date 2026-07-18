"use client";

import { toPersianDigits } from "../../../../lib/persian";
import type { DayOption, Daypart, SlotAvailability } from "../../../../lib/types";

const DAYPARTS: { id: Daypart; label: string; range: string }[] = [
  { id: "morning", label: "صبح", range: "۶ تا ۱۲" },
  { id: "noon", label: "ظهر", range: "۱۲ تا ۱۸" },
  { id: "evening", label: "عصر", range: "۱۸ تا ۲۴" },
  { id: "night", label: "شب", range: "۲۴ تا ۶" },
];

const STATE_LABEL: Record<SlotAvailability, string> = {
  free: "کاملا خالی",
  half: "نیمه خالی",
  blocked: "غیرقابل رزرو",
};

const CELL_TONE: Record<SlotAvailability, string> = {
  free: "bg-primary/15 active:bg-primary/25",
  half: "bg-primary/45 active:bg-primary/55",
  blocked: "bg-edge/60",
};

const SWATCH_TONE: Record<SlotAvailability, string> = {
  free: "bg-primary/15",
  half: "bg-primary/45",
  blocked: "bg-edge/60",
};

interface Props {
  days: DayOption[];
  /** Per day id: [morning, noon, evening, night]. */
  availability: Record<string, SlotAvailability[]>;
  selectedDayId: string | null;
  selectedDaypart: Daypart | null;
  onSelect: (dayId: string, daypart: Daypart) => void;
}

/** Court availability grid: day columns × daypart rows; tap a free/half cell to pick the slot. */
export default function AvailabilityHeatmap({
  days,
  availability,
  selectedDayId,
  selectedDaypart,
  onSelect,
}: Props) {
  return (
    <div className="w-full bg-white rounded-group p-3 flex flex-col gap-3 shadow-card">
      <h2 className="text-base font-bold text-ink-soft text-right" dir="rtl">
        زمان‌بندی براساس زمین
      </h2>

      {/* legend — LTR wrapper pins content right; dir only on the labels */}
      <div className="flex items-center justify-end gap-4">
        {(["blocked", "half", "free"] as const).map((state) => (
          <span key={state} className="flex items-center gap-1.5">
            <span className={`size-3 rounded ${SWATCH_TONE[state]}`} aria-hidden />
            <span className="text-xs text-muted" dir="rtl">
              {STATE_LABEL[state]}
            </span>
          </span>
        ))}
      </div>

      {/* visual grid only — each cell button carries its own full aria-label,
          so no ARIA grid semantics (which would require row/gridcell + arrow keys) */}
      <div
        dir="rtl"
        className="grid gap-1"
        style={{ gridTemplateColumns: `auto repeat(${days.length}, minmax(0, 1fr))` }}
      >
        <span aria-hidden />
        {days.map((d) => (
          <span
            key={d.id}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 ${
              d.past ? "text-muted/60" : "text-ink-soft"
            }`}
          >
            <span className="text-tiny leading-none">{d.weekday}</span>
            <span className="text-xs font-bold leading-none">
              {toPersianDigits(String(d.day))}
            </span>
          </span>
        ))}

        {DAYPARTS.map((part, row) => (
          <div key={part.id} className="contents">
            <span className="flex flex-col items-end justify-center gap-0.5 pl-2">
              <span className="text-xs font-bold text-ink-soft leading-none" dir="rtl">
                {part.label}
              </span>
              <span className="text-tiny text-muted leading-none" dir="rtl">
                {part.range}
              </span>
            </span>
            {days.map((d) => {
              const state = availability[d.id]?.[row] ?? "blocked";
              const isSelected = selectedDayId === d.id && selectedDaypart === part.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={state === "blocked"}
                  aria-label={`${d.weekday} ${toPersianDigits(String(d.day))}، ${part.label}: ${STATE_LABEL[state]}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(d.id, part.id)}
                  className={`aspect-square min-h-11 rounded-lg ${
                    isSelected ? "bg-primary ring-2 ring-primary/30" : CELL_TONE[state]
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
