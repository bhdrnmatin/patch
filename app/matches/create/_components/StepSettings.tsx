"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import OptionSheet, { type SheetOption } from "./OptionSheet";
import ToggleSetting from "./ToggleSetting";
import { toPersianDigits } from "../../../../lib/persian";
import type { CreateMatchDraft } from "../../../../lib/types";

export const LEVEL_OPTIONS: SheetOption[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: String(n),
  label: `لول ${toPersianDigits(String(n))}`,
}));

export const GENDER_OPTIONS: SheetOption[] = [
  { id: "male", label: "فقط آقایان" },
  { id: "female", label: "فقط بانوان" },
  { id: "mixed", label: "مختلط" },
];

export const FEE_OPTIONS: SheetOption[] = [50, 100, 150, 200, 250].map((n) => ({
  id: String(n * 1000),
  label: `${toPersianDigits(String(n))} هزار تومان`,
}));

type SheetId = "min" | "max" | "gender" | "fee";

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
}

/** Step ۵ تنظیمات: five toggle settings with dependent selects. */
export default function StepSettings({ draft, patch }: Props) {
  const [openSheet, setOpenSheet] = useState<SheetId | null>(null);
  const close = () => setOpenSheet(null);

  return (
    <>
      <ToggleSetting
        label="حداقل سطح برای ورود"
        enabled={draft.minLevel.enabled}
        onToggle={(enabled) => patch({ minLevel: { ...draft.minLevel, enabled } })}
      >
        <SelectField
          label="حداقل سطح"
          value={LEVEL_OPTIONS.find((o) => o.id === String(draft.minLevel.value))?.label}
          onClick={() => setOpenSheet("min")}
        />
      </ToggleSetting>

      <ToggleSetting
        label="حداکثر سطح برای ورود"
        enabled={draft.maxLevel.enabled}
        onToggle={(enabled) => patch({ maxLevel: { ...draft.maxLevel, enabled } })}
      >
        <SelectField
          label="حداکثر سطح"
          value={LEVEL_OPTIONS.find((o) => o.id === String(draft.maxLevel.value))?.label}
          onClick={() => setOpenSheet("max")}
        />
      </ToggleSetting>

      <ToggleSetting
        label="ترجیح جنسیتی"
        enabled={draft.gender.enabled}
        onToggle={(enabled) => patch({ gender: { ...draft.gender, enabled } })}
      >
        <SelectField
          label="انتخاب جنسیت"
          value={GENDER_OPTIONS.find((o) => o.id === draft.gender.value)?.label}
          onClick={() => setOpenSheet("gender")}
        />
      </ToggleSetting>

      <ToggleSetting
        label="هزینه ورودی"
        enabled={draft.entryFee.enabled}
        onToggle={(enabled) => patch({ entryFee: { ...draft.entryFee, enabled } })}
      >
        <SelectField
          label="انتخاب هزینه"
          value={FEE_OPTIONS.find((o) => o.id === String(draft.entryFee.value))?.label}
          onClick={() => setOpenSheet("fee")}
        />
      </ToggleSetting>

      <ToggleSetting
        label="تایید خودکار ورود بازیکن"
        enabled={draft.autoApprove}
        onToggle={(autoApprove) => patch({ autoApprove })}
      />

      <OptionSheet
        open={openSheet === "min"}
        title="حداقل سطح"
        options={LEVEL_OPTIONS}
        value={draft.minLevel.value === null ? null : String(draft.minLevel.value)}
        onSelect={(id) => {
          patch({ minLevel: { enabled: true, value: Number(id) } });
          close();
        }}
        onClose={close}
      />
      <OptionSheet
        open={openSheet === "max"}
        title="حداکثر سطح"
        options={LEVEL_OPTIONS}
        value={draft.maxLevel.value === null ? null : String(draft.maxLevel.value)}
        onSelect={(id) => {
          patch({ maxLevel: { enabled: true, value: Number(id) } });
          close();
        }}
        onClose={close}
      />
      <OptionSheet
        open={openSheet === "gender"}
        title="انتخاب جنسیت"
        options={GENDER_OPTIONS}
        value={draft.gender.value}
        onSelect={(id) => {
          patch({ gender: { enabled: true, value: id as "male" | "female" | "mixed" } });
          close();
        }}
        onClose={close}
      />
      <OptionSheet
        open={openSheet === "fee"}
        title="انتخاب هزینه"
        options={FEE_OPTIONS}
        value={draft.entryFee.value === null ? null : String(draft.entryFee.value)}
        onSelect={(id) => {
          patch({ entryFee: { enabled: true, value: Number(id) } });
          close();
        }}
        onClose={close}
      />
    </>
  );
}
