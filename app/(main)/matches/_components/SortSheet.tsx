"use client";

import BottomSheet from "./BottomSheet";
import FilterSection, { type ChipOption } from "./FilterSection";
import { SortIcon } from "../../_components/icons";

const DIRECTION: ChipOption[] = [
  { id: "near", label: "نزدیک‌ترین" },
  { id: "far", label: "دورترین" },
];
const FEE: ChipOption[] = [
  { id: "most", label: "بیشترین" },
  { id: "least", label: "کمترین" },
];

/** One direction per criterion; "" = not sorting by it. */
export interface MatchSort {
  distance: string;
  date: string;
  fee: string;
}

export const DEFAULT_MATCH_SORT: MatchSort = { distance: "", date: "", fee: "" };

interface Props {
  open: boolean;
  onClose: () => void;
  value: MatchSort;
  onChange: (value: MatchSort) => void;
}

/** Sort bottom-sheet: one direction choice per criterion; tap again to clear. */
export default function SortSheet({ open, onClose, value, onChange }: Props) {
  const set = (key: keyof MatchSort) => (id: string) =>
    onChange({ ...value, [key]: value[key] === id ? "" : id });

  const footer = (
    <>
      <button
        type="button"
        onClick={() => onChange(DEFAULT_MATCH_SORT)}
        className="flex-1 min-w-0 h-10 rounded-full bg-black/10 border-[1.5px] border-white/15 text-ink-soft font-bold text-sm active:opacity-80"
      >
        حذف مرتب‌سازی
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex-1 min-w-0 h-10 rounded-card bg-primary hover:bg-primary-hover text-white font-bold text-sm active:opacity-80"
      >
        اعمال
      </button>
    </>
  );

  return (
    <BottomSheet open={open} onClose={onClose} title="مرتب‌سازی" icon={<SortIcon className="size-4" />} footer={footer}>
      <FilterSection label="مسافت" options={DIRECTION} value={value.distance} onChange={set("distance")} />
      <FilterSection label="تاریخ" options={DIRECTION} value={value.date} onChange={set("date")} />
      <FilterSection label="هزینه ورودی" options={FEE} value={value.fee} onChange={set("fee")} />
    </BottomSheet>
  );
}
