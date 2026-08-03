"use client";

import { useState } from "react";
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
  /** Show a top search field that filters options by label (long lists). */
  searchable?: boolean;
  searchPlaceholder?: string;
}

/** Generic pick-one list in a bottom sheet (PlayerPickerSheet row style, no avatar). */
export default function OptionSheet({
  open,
  title,
  options,
  value,
  onSelect,
  onClose,
  searchable,
  searchPlaceholder,
}: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title} fill={searchable}>
      {/* Body mounts fresh on each open (BottomSheet unmounts on close), so the
          search query resets without a state-syncing effect. */}
      <SheetBody
        options={options}
        value={value}
        onSelect={onSelect}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
      />
    </BottomSheet>
  );
}

function SheetBody({
  options,
  value,
  onSelect,
  searchable,
  searchPlaceholder = "جستجو...",
}: Pick<Props, "options" | "value" | "onSelect" | "searchable" | "searchPlaceholder">) {
  const [query, setQuery] = useState("");
  const q = query.trim();
  const filtered = searchable && q ? options.filter((o) => o.label.includes(q)) : options;

  return (
    <>
      {searchable && (
        <input
          dir="rtl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="sticky top-0 z-10 w-full h-11 rounded-card bg-white border border-edge px-4 text-sm text-ink-soft placeholder-muted focus:outline-none focus:border-primary shadow-card"
        />
      )}
      <ul className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <li className="px-4 py-4 text-sm text-muted text-center" dir="rtl">
            موردی یافت نشد
          </li>
        ) : (
          filtered.map((option) => {
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
          })
        )}
      </ul>
    </>
  );
}
