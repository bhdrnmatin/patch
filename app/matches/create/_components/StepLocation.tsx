"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import OptionSheet from "./OptionSheet";
import InfoBanner from "../../[id]/_components/InfoBanner";
import type { CourtOption, CreateMatchDraft } from "../../../../lib/types";

const YES_NO = [
  { value: true, label: "بله" },
  { value: false, label: "خیر" },
];

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
  courts: CourtOption[];
}

/** Step ۲ مکان: locked city + reserved-court gate → searchable court picker. */
export default function StepLocation({ draft, patch, courts }: Props) {
  const [courtSheet, setCourtSheet] = useState(false);
  const selectedCourt = courts.find((c) => c.id === draft.courtId);

  return (
    <>
      {/* Locked to Alborz/Karaj at launch — single supported city. */}
      <SelectField label="استان" value="البرز" disabled />
      <SelectField label="شهر" value="کرج" disabled />

      <div className="w-full flex flex-col gap-2">
        <span className="text-sm font-bold text-ink-soft text-right" dir="rtl">
          آیا زمین رزرو کرده‌اید؟
        </span>
        <div className="flex gap-3" dir="rtl">
          {YES_NO.map((o) => {
            const selected = draft.reserved === o.value;
            return (
              <button
                key={o.label}
                type="button"
                aria-pressed={selected}
                onClick={() => patch({ reserved: o.value })}
                className={`flex-1 h-12 rounded-card text-sm font-bold border shadow-card active:opacity-80 ${
                  selected
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-edge text-ink-soft"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {draft.reserved === false && (
        <InfoBanner text="برای ساخت مَچ باید ابتدا یک زمین رزرو کنید." />
      )}

      {draft.reserved === true && (
        <>
          <SelectField
            label="زمین رزرو‌شده"
            value={selectedCourt?.club}
            placeholder="انتخاب زمین"
            onClick={() => setCourtSheet(true)}
          />
          {selectedCourt && (
            <div className="w-full bg-white rounded-group p-4 flex flex-col items-end gap-3 shadow-card">
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted" dir="rtl">
                  موقعیت زمین
                </span>
                <span className="text-sm text-ink-soft text-right" dir="rtl">
                  {selectedCourt.location}
                </span>
              </div>
              {/* Static map — exact pin isn't wired yet. */}
              <img
                src="/images/court-map.webp"
                alt="موقعیت زمین روی نقشه"
                className="w-full h-[203px] rounded-xl object-cover"
              />
              <button
                type="button"
                className="w-full bg-primary rounded-card px-4 py-3 text-sm font-bold leading-4 text-white active:opacity-90"
                dir="rtl"
              >
                مسیریابی
              </button>
            </div>
          )}
          <OptionSheet
            open={courtSheet}
            title="انتخاب زمین"
            searchable
            searchPlaceholder="جستجوی زمین..."
            options={courts.map((c) => ({ id: c.id, label: c.club }))}
            value={draft.courtId}
            onSelect={(id) => {
              patch({ courtId: id });
              setCourtSheet(false);
            }}
            onClose={() => setCourtSheet(false)}
          />
        </>
      )}
    </>
  );
}
