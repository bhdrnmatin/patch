"use client";

import { useState } from "react";
import { toPersianDigits } from "@/lib/persian";
import BottomSheet from "./BottomSheet";
import FilterSection, { type ChipOption } from "./FilterSection";
import { FilterSearchIcon } from "./icons";

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

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Filter bottom-sheet: multi-select chips per facet. */
export default function FilterSheet({ open, onClose }: Props) {
  const [status, setStatus] = useState<string[]>(["active"]);
  const [levels, setLevels] = useState<string[]>([]);
  const [distance, setDistance] = useState<string[]>([]);
  const [date, setDate] = useState<string[]>([]);
  const [type, setType] = useState<string[]>(["competitive"]);

  const toggle =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) =>
      setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const clearAll = () => {
    setStatus([]);
    setLevels([]);
    setDistance([]);
    setDate([]);
    setType([]);
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={clearAll}
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
      <FilterSection label="وضعیت" options={STATUS} value={status} onChange={toggle(setStatus)} />
      <FilterSection label="رده‌بندی" options={LEVELS} value={levels} onChange={toggle(setLevels)} />
      <FilterSection label="مسافت" options={DISTANCE} value={distance} onChange={toggle(setDistance)} />
      <FilterSection label="تاریخ" options={DATE} value={date} onChange={toggle(setDate)} />
      <FilterSection label="نوع مسابقه" options={TYPE} value={type} onChange={toggle(setType)} />
    </BottomSheet>
  );
}
