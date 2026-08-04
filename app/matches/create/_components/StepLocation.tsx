"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import OptionSheet from "./OptionSheet";
import FilterSection, {
  type ChipOption,
} from "../../../(main)/matches/_components/FilterSection";
import InfoBanner from "../../[id]/_components/InfoBanner";
import type { CourtOption, CreateMatchDraft } from "../../../../lib/types";

const YES_NO: ChipOption[] = [
  { id: "yes", label: "بله" },
  { id: "no", label: "خیر" },
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

      <div className="w-full bg-white rounded-group p-3 shadow-card">
        <FilterSection
          label="آیا زمین رزرو کرده‌اید؟"
          options={YES_NO}
          value={draft.reserved === null ? "" : draft.reserved ? "yes" : "no"}
          onChange={(id) => patch({ reserved: id === "yes" })}
        />
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
