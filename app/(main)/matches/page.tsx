"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMatchDays, getMatchList } from "@/lib/data";
import MatchesHeader from "./_components/MatchesHeader";
import MatchCard from "./_components/MatchCard";
import SortSheet, { DEFAULT_MATCH_SORT, type MatchSort } from "./_components/SortSheet";
import FilterSheet, { DEFAULT_MATCH_FILTER, type MatchFilter } from "./_components/FilterSheet";

type Sheet = "sort" | "filter" | null;

export default function MatchesPage() {
  const { data: days = [] } = useQuery({ queryKey: ["matchDays"], queryFn: getMatchDays });
  const { data: matchList = [] } = useQuery({ queryKey: ["matches"], queryFn: getMatchList });
  const [selectedDay, setSelectedDay] = useState("d17");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [filter, setFilter] = useState<MatchFilter>(DEFAULT_MATCH_FILTER);
  const [sort, setSort] = useState<MatchSort>(DEFAULT_MATCH_SORT);

  // distance/date/type facets and distance/date sorts have no backing fields
  // on MatchListItem yet — they select but don't narrow until the API adds data.
  const visibleMatches = useMemo(() => {
    let list = matchList;
    if (filter.status.length > 0) list = list.filter((m) => filter.status.includes(m.status));
    if (filter.levels.length > 0)
      list = list.filter((m) => filter.levels.includes(String(m.avgLevel)));
    if (sort.fee)
      list = [...list].sort((a, b) => (sort.fee === "least" ? a.price - b.price : b.price - a.price));
    return list;
  }, [matchList, filter, sort]);

  return (
    <div className="w-full min-h-dvh">
      <MatchesHeader
        days={days}
        selectedId={selectedDay}
        onSelect={setSelectedDay}
        onFilter={() => setSheet("filter")}
        onSort={() => setSheet("sort")}
      />

      <div className="px-6 py-6 flex flex-col gap-6">
        {visibleMatches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
        {visibleMatches.length === 0 && matchList.length > 0 && (
          <p className="text-sm text-muted text-center py-10" dir="rtl">
            مسابقه‌ای با این فیلترها پیدا نشد.
          </p>
        )}
      </div>

      <SortSheet open={sheet === "sort"} onClose={() => setSheet(null)} value={sort} onChange={setSort} />
      <FilterSheet
        open={sheet === "filter"}
        onClose={() => setSheet(null)}
        value={filter}
        onChange={setFilter}
      />
    </div>
  );
}
