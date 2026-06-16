import type { DayOption } from "@/lib/types";
import DateCell from "./DateCell";

interface Props {
  days: DayOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Horizontally scrollable RTL row of day cells. */
export default function DateSelector({ days, selectedId, onSelect }: Props) {
  return (
    <div
      dir="rtl"
      className="flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {days.map((d) => (
        <DateCell
          key={d.id}
          day={d.day}
          weekday={d.weekday}
          past={d.past}
          selected={d.id === selectedId}
          onClick={() => onSelect(d.id)}
        />
      ))}
    </div>
  );
}
