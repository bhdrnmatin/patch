"use client";

import { useState } from "react";
import { toPersianDigits } from "../../../../lib/persian";
import {
  JALALI_MONTHS,
  JALALI_WEEKDAYS,
  addDaysISO,
  isoToJalali,
  jalaaliMonthLength,
  jalaliToISO,
  jalaliWeekdayOfISO,
  todayISO,
} from "../../../../lib/jalali";
import type { CreateMatchDraft } from "../../../../lib/types";

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
}

// 30-min slots across the playing day (06:00 … 23:30).
const TIME_SLOTS = buildTimeSlots(6, 23);
const DURATIONS = [60, 90, 120];

function buildTimeSlots(startHour: number, endHour: number): string[] {
  const out: string[] = [];
  for (let h = startHour; h <= endHour; h += 1) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}

/** Step ۳ زمان‌بندی: quick-day chips + jalali calendar + time slots + duration. */
export default function StepSchedule({ draft, patch }: Props) {
  const today = todayISO();
  // Which jalali month the calendar shows; seed from the picked date or today.
  const seed = isoToJalali(draft.date ?? today);
  const [view, setView] = useState({ jy: seed.jy, jm: seed.jm });

  const quick = [
    { label: "امروز", iso: today },
    { label: "فردا", iso: addDaysISO(today, 1) },
    { label: "پس‌فردا", iso: addDaysISO(today, 2) },
  ];

  const monthLen = jalaaliMonthLength(view.jy, view.jm);
  const leading = jalaliWeekdayOfISO(jalaliToISO(view.jy, view.jm, 1)); // blanks before day 1
  const days = Array.from({ length: monthLen }, (_, i) => {
    const jd = i + 1;
    const iso = jalaliToISO(view.jy, view.jm, jd);
    return { jd, iso, past: iso < today };
  });

  const shiftMonth = (delta: number) =>
    setView((v) => {
      const jm = v.jm + delta;
      if (jm < 1) return { jy: v.jy - 1, jm: 12 };
      if (jm > 12) return { jy: v.jy + 1, jm: 1 };
      return { jy: v.jy, jm };
    });

  const pickDay = (iso: string) => patch({ date: iso });
  const goToMonthOf = (iso: string) => {
    const j = isoToJalali(iso);
    setView({ jy: j.jy, jm: j.jm });
  };

  return (
    <>
      {/* Quick day chips */}
      <div className="flex gap-3" dir="rtl">
        {quick.map((q) => {
          const selected = draft.date === q.iso;
          return (
            <button
              key={q.label}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                pickDay(q.iso);
                goToMonthOf(q.iso);
              }}
              className={`flex-1 h-12 rounded-card text-sm font-bold border shadow-card active:opacity-80 ${
                selected ? "bg-primary border-primary text-white" : "bg-white border-edge text-ink-soft"
              }`}
            >
              {q.label}
            </button>
          );
        })}
      </div>

      {/* Jalali calendar */}
      <div className="w-full bg-white rounded-group p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="ماه بعد"
            onClick={() => shiftMonth(1)}
            className="size-8 flex items-center justify-center rounded-full text-ink-soft active:bg-surface"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm font-bold text-primary" dir="rtl">
            {JALALI_MONTHS[view.jm - 1]} {toPersianDigits(String(view.jy))}
          </span>
          <button
            type="button"
            aria-label="ماه قبل"
            onClick={() => shiftMonth(-1)}
            className="size-8 flex items-center justify-center rounded-full text-ink-soft active:bg-surface"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-2" dir="rtl">
          {JALALI_WEEKDAYS.map((w) => (
            <span key={w} className="text-center text-xs text-muted">
              {w}
            </span>
          ))}
          {Array.from({ length: leading }).map((_, i) => (
            <span key={`blank-${i}`} aria-hidden />
          ))}
          {days.map((d) => {
            const selected = draft.date === d.iso;
            return (
              <div key={d.iso} className="flex items-center justify-center">
                <button
                  type="button"
                  disabled={d.past}
                  aria-pressed={selected}
                  onClick={() => pickDay(d.iso)}
                  className={`size-9 rounded-full text-sm flex items-center justify-center ${
                    selected
                      ? "bg-primary text-white font-bold"
                      : d.past
                        ? "text-edge cursor-default"
                        : "text-ink-soft active:bg-surface"
                  }`}
                >
                  {toPersianDigits(String(d.jd))}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start time */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-ink-soft text-right" dir="rtl">
          ساعت شروع
        </span>
        <div
          className="flex gap-2 overflow-x-auto -mx-6 px-6 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          dir="rtl"
        >
          {TIME_SLOTS.map((t) => {
            const selected = draft.time === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={selected}
                onClick={() => patch({ time: t })}
                className={`h-11 px-4 shrink-0 rounded-card text-sm font-bold border shadow-card active:opacity-80 ${
                  selected ? "bg-primary border-primary text-white" : "bg-white border-edge text-ink-soft"
                }`}
              >
                {toPersianDigits(t)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-ink-soft text-right" dir="rtl">
          مدت بازی
        </span>
        <div className="flex gap-3" dir="rtl">
          {DURATIONS.map((d) => {
            const selected = draft.duration === d;
            return (
              <button
                key={d}
                type="button"
                aria-pressed={selected}
                onClick={() => patch({ duration: d })}
                className={`flex-1 h-12 rounded-card text-sm font-bold border shadow-card active:opacity-80 ${
                  selected ? "bg-primary border-primary text-white" : "bg-white border-edge text-ink-soft"
                }`}
              >
                {toPersianDigits(String(d))} دقیقه
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
