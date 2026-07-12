"use client";

import { useState } from "react";
import SelectField from "./SelectField";
import OptionSheet from "./OptionSheet";
import AvailabilityHeatmap from "./AvailabilityHeatmap";
import DateSelector from "../../../(main)/_components/DateSelector";
import type {
  CreateMatchDraft,
  DayOption,
  MonthOption,
  SlotAvailability,
} from "../../../../lib/types";

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
  months: MonthOption[];
  days: DayOption[];
  availability: Record<string, SlotAvailability[]>;
}

/** Step ۳ زمان‌بندی: month select + day strip + availability heatmap. */
export default function StepSchedule({ draft, patch, months, days, availability }: Props) {
  const [monthOpen, setMonthOpen] = useState(false);

  return (
    <>
      <SelectField
        label="ماه"
        value={months.find((m) => m.id === draft.monthId)?.label}
        onClick={() => setMonthOpen(true)}
      />
      {/* DateSelector has its own px-6; pull it flush with the step column */}
      <div className="-mx-6">
        <DateSelector
          days={days}
          selectedId={draft.dayId ?? ""}
          tone="light"
          onSelect={(dayId) => patch({ dayId, daypart: null })}
        />
      </div>
      <AvailabilityHeatmap
        days={days}
        availability={availability}
        selectedDayId={draft.dayId}
        selectedDaypart={draft.daypart}
        onSelect={(dayId, daypart) => patch({ dayId, daypart })}
      />
      <OptionSheet
        open={monthOpen}
        title="انتخاب ماه"
        options={months}
        value={draft.monthId}
        onSelect={(monthId) => {
          patch({ monthId });
          setMonthOpen(false);
        }}
        onClose={() => setMonthOpen(false)}
      />
    </>
  );
}
