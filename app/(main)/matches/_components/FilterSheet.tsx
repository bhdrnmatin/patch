"use client";

import { toPersianDigits } from "@/lib/persian";
import BottomSheet from "./BottomSheet";
import FilterSection, { type ChipOption } from "./FilterSection";
import { FilterSearchIcon } from "../../_components/icons";

const STATUS: ChipOption[] = [
  { id: "active", label: "جاری" },
  { id: "not-held", label: "برگزار نشده" },
  { id: "held", label: "برگزار شده" },
];
const LEVELS: ChipOption[] = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: String(n),
  label: toPersianDigits(String(n)),
}));
const DISTANCE: ChipOption[] = [
  { id: "near", label: "نزدیک من" },
  { id: "city", label: "شهر من" },
];
const DATE: ChipOption[] = [
  { id: "today", label: "امروز" },
  { id: "week", label: "این هفته" },
  { id: "month", label: "این ماه" },
];
const TYPE: ChipOption[] = [
  { id: "competitive", label: "رقابتی" },
  { id: "friendly", label: "دوستانه" },
];

/** Multi-select per facet; empty array = facet not filtering. */
export interface MatchFilter {
  status: string[];
  levels: string[];
  distance: string[];
  date: string[];
  type: string[];
}

export const DEFAULT_MATCH_FILTER: MatchFilter = {
  status: [],
  levels: [],
  distance: [],
  date: [],
  type: [],
};

interface Props {
  open: boolean;
  onClose: () => void;
  value: MatchFilter;
  onChange: (value: MatchFilter) => void;
}

/** Filter bottom-sheet: multi-select chips per facet. */
export default function FilterSheet({ open, onClose, value, onChange }: Props) {
  const toggle = (key: keyof MatchFilter) => (id: string) => {
    const current = value[key];
    onChange({
      ...value,
      [key]: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    });
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={() => onChange(DEFAULT_MATCH_FILTER)}
        className="flex-1 min-w-0 h-10 rounded-full bg-black/10 border-[1.5px] border-white/15 text-ink-soft font-bold text-sm active:opacity-80"
      >
        حذف فیلتر
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
    <BottomSheet open={open} onClose={onClose} title="فیلتر" icon={<FilterSearchIcon className="size-4" />} footer={footer}>
      <FilterSection label="وضعیت" options={STATUS} value={value.status} onChange={toggle("status")} />
      <FilterSection label="رده‌بندی" options={LEVELS} value={value.levels} onChange={toggle("levels")} />
      <FilterSection label="مسافت" options={DISTANCE} value={value.distance} onChange={toggle("distance")} />
      <FilterSection label="تاریخ" options={DATE} value={value.date} onChange={toggle("date")} />
      <FilterSection label="نوع مَچ" options={TYPE} value={value.type} onChange={toggle("type")} />
    </BottomSheet>
  );
}
