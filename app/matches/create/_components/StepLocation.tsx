"use client";

import TextField from "./TextField";
import FilterSection, {
  type ChipOption,
} from "../../../(main)/matches/_components/FilterSection";
import type { CourtOption, CreateMatchDraft } from "../../../../lib/types";

const YES_NO: ChipOption[] = [
  { id: "yes", label: "بله" },
  { id: "no", label: "خیر" },
];

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
  courts: CourtOption[];
}

/** Step ۲ مکان: own-court toggle → court search grid | address + map. */
export default function StepLocation({ draft, patch, courts }: Props) {
  const search = draft.courtSearch.trim();
  const filtered = search ? courts.filter((c) => c.name.includes(search)) : courts;

  return (
    <>
      <div className="w-full bg-white rounded-group p-3 shadow-card">
        <FilterSection
          label="آیا خودتان زمین تعریف می‌کنید؟"
          options={YES_NO}
          value={draft.customCourt === null ? "" : draft.customCourt ? "yes" : "no"}
          onChange={(id) => patch({ customCourt: id === "yes" })}
        />
      </div>

      {draft.customCourt === false && (
        <div className="w-full bg-white rounded-group p-3 flex flex-col gap-3 shadow-card">
          <h2 className="text-base font-semibold text-ink-soft text-right" dir="rtl">
            جستجو در زمین‌ها
          </h2>
          <input
            type="text"
            value={draft.courtSearch}
            onChange={(e) => patch({ courtSearch: e.target.value })}
            placeholder="جستجو..."
            aria-label="جستجو در زمین‌ها"
            dir="rtl"
            className="w-full h-11 rounded-full bg-surface border border-edge px-4 text-sm text-ink-soft placeholder:text-muted focus:outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-3" dir="rtl">
            {filtered.map((court) => {
              const isSelected = draft.courtId === court.id;
              return (
                <button
                  key={court.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => patch({ courtId: court.id })}
                  className={`h-11 rounded-full border text-sm font-semibold active:opacity-80 ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-edge bg-white text-ink-soft"
                  }`}
                  dir="rtl"
                >
                  {court.name}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-2 text-sm text-muted text-center py-4" dir="rtl">
                زمینی پیدا نشد.
              </p>
            )}
          </div>
        </div>
      )}

      {draft.customCourt === true && (
        <div className="w-full bg-white rounded-group p-3 flex flex-col gap-3 shadow-card">
          <TextField
            label="آدرس"
            value={draft.address}
            onChange={(address) => patch({ address })}
            placeholder="آدرس زمین"
          />
          <img
            src="/images/court-map.webp"
            alt="نقشه محدوده زمین"
            className="w-full h-[203px] rounded-xl object-cover"
          />
          <button
            type="button"
            className="w-full h-10 bg-white border border-primary rounded-group text-sm font-semibold text-primary active:opacity-80"
            dir="rtl"
          >
            انتخاب روی نقشه
          </button>
        </div>
      )}
    </>
  );
}
