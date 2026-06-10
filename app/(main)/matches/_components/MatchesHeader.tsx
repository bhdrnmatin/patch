import type { DayOption } from "@/lib/types";
import IconButton from "./IconButton";
import DateSelector from "./DateSelector";
import { FilterSearchIcon, SortIcon } from "./icons";

interface Props {
  days: DayOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onFilter: () => void;
  onSort: () => void;
}

/** Matches hero header: athlete background + title + filter/sort buttons + date strip. */
export default function MatchesHeader({ days, selectedId, onSelect, onFilter, onSort }: Props) {
  return (
    <header className="relative h-[276px] bg-primary rounded-b-[24px] overflow-hidden">
      {/* Blurred court backdrop with blue tint */}
      <div className="absolute inset-0 blur-[2px]">
        <img src="/images/matches-header-bg.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/55" />
      </div>

      {/* Sharp athlete foreground */}
      <img src="/images/matches-header-athlete.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Top darkening gradient for contrast */}
      <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />

      {/* Filter + sort buttons (visual left) */}
      <div className="absolute left-6 top-14 flex items-center gap-2">
        <IconButton label="فیلتر" icon={<FilterSearchIcon />} onClick={onFilter} />
        <IconButton label="مرتب‌سازی" icon={<SortIcon />} onClick={onSort} />
      </div>

      <h1
        dir="rtl"
        className="absolute right-6 top-20 -translate-y-1/2 text-white text-2xl font-bold leading-8 drop-shadow-[0px_1px_4px_rgba(0,0,0,0.35)]"
      >
        مسابقه
      </h1>

      {/* Date strip overlapping the bottom of the hero */}
      <div className="absolute inset-x-0 bottom-3">
        <DateSelector days={days} selectedId={selectedId} onSelect={onSelect} />
      </div>
    </header>
  );
}
