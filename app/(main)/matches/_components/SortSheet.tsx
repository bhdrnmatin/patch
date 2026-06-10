"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import FilterSection, { type ChipOption } from "./FilterSection";
import { SortIcon } from "./icons";

const DIRECTION: ChipOption[] = [
  { id: "near", label: "نزدیک‌ترین" },
  { id: "far", label: "دورترین" },
];
const FEE: ChipOption[] = [
  { id: "most", label: "بیشترین" },
  { id: "least", label: "کمترین" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Sort bottom-sheet: one direction choice per criterion. */
export default function SortSheet({ open, onClose }: Props) {
  const [distance, setDistance] = useState("near");
  const [date, setDate] = useState("near");
  const [fee, setFee] = useState("least");

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="flex-1 min-w-0 h-10 rounded-full bg-black/10 border-[1.5px] border-white/15 text-[#253343] font-bold text-sm active:opacity-80"
      >
        بستن
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex-1 min-w-0 h-10 rounded-card bg-primary hover:bg-primary-hover text-white font-bold text-sm active:opacity-80"
      >
        متوجه شدم
      </button>
    </>
  );

  return (
    <BottomSheet open={open} onClose={onClose} title="مرتب‌سازی" icon={<SortIcon className="size-4" />} footer={footer}>
      <FilterSection label="مسافت" options={DIRECTION} value={distance} onChange={setDistance} />
      <FilterSection label="تاریخ" options={DIRECTION} value={date} onChange={setDate} />
      <FilterSection label="هزینه ورودی" options={FEE} value={fee} onChange={setFee} />
    </BottomSheet>
  );
}
