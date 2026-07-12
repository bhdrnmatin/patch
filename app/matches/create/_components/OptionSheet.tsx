"use client";

import BottomSheet from "../../../(main)/matches/_components/BottomSheet";
import { CheckIcon } from "../../[id]/_components/icons";

export interface SheetOption {
  id: string;
  label: string;
}

interface Props {
  open: boolean;
  title: string;
  options: SheetOption[];
  value: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

/** Generic pick-one list in a bottom sheet (PlayerPickerSheet row style, no avatar). */
export default function OptionSheet({ open, title, options, value, onSelect, onClose }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <ul className="flex flex-col gap-2">
        {options.map((option) => {
          const isSelected = value === option.id;
          return (
            <li key={option.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(option.id)}
                className={`w-full bg-white rounded-full p-3 flex items-center justify-end gap-3 shadow-card border active:opacity-80 ${
                  isSelected ? "border-primary" : "border-white/15"
                }`}
              >
                {isSelected && <CheckIcon className="size-4 shrink-0 text-primary mr-auto" />}
                <span className="text-sm font-bold text-ink-soft" dir="rtl">
                  {option.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
