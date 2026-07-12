"use client";

import { useId } from "react";
import { ChevronDownIcon } from "../../[id]/_components/icons";

interface Props {
  label: string;
  /** Display label of the current selection; omitted → placeholder state. */
  value?: string;
  placeholder?: string;
  onClick: () => void;
}

/** Light select trigger: label above, white field with chevron; opens a picker sheet. */
export default function SelectField({ label, value, placeholder = "انتخاب کنید", onClick }: Props) {
  const labelId = useId();
  const valueId = useId();

  return (
    <div className="w-full flex flex-col gap-2">
      <span id={labelId} className="text-sm font-semibold text-ink-soft text-right" dir="rtl">
        {label}
      </span>
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-labelledby={`${labelId} ${valueId}`}
        className="w-full h-12 rounded-card bg-white border border-edge px-4 shadow-card flex items-center justify-between gap-2 focus:outline-none focus:border-primary active:opacity-80"
      >
        <ChevronDownIcon className="size-4 shrink-0 text-muted" />
        <span
          id={valueId}
          dir="rtl"
          className={`text-sm truncate ${value ? "text-ink-soft" : "text-muted"}`}
        >
          {value ?? placeholder}
        </span>
      </button>
    </div>
  );
}
