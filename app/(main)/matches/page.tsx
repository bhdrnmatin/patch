"use client";

import { useMemo, useState } from "react";
import { dateFacetRange } from "@/lib/jalali";
import { useQuery } from "@tanstack/react-query";
import { getMatchDays, getMatchList, getMyPrivateMatches } from "@/lib/data";
import MatchesHeader from "./_components/MatchesHeader";
import MatchCard from "./_components/MatchCard";
import SortSheet, { DEFAULT_MATCH_SORT, type MatchSort } from "./_components/SortSheet";
import FilterSheet, { DEFAULT_MATCH_FILTER, type MatchFilter } from "./_components/FilterSheet";
import EmptyMatches from "./_components/EmptyMatches";

type Sheet = "sort" | "filter" | null;

export default function MatchesPage() {
  const { data: days = [] } = useQuery({ queryKey: ["matchDays"], queryFn: getMatchDays });
  const { data: publicList = [], isLoading } = useQuery({ queryKey: ["matches"], queryFn: getMatchList });
  // Under ["matches"] so every invalidation of the list refreshes these too.
  const { data: privateList = [] } = useQuery({
    queryKey: ["matches", "private"],
    queryFn: getMyPrivateMatches,
  });
  const matchList = useMemo(() => {
    const listed = new Set(publicList.map((m) => m.id));
    return [...publicList, ...privateList.filter((m) => !listed.has(m.id))];
  }, [publicList, privateList]);
  // No day selected on open: the list shows every match, and the strip narrows
  // only once a cell is tapped (user decision 2026-09-14). Defaulting to today
  // would open the page empty — matches are days out, not hours. Re-tapping the
  // selected cell clears it, which is the only way back to the full list.
  const [selectedDay, setSelectedDay] = useState("");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [filter, setFilter] = useState<MatchFilter>(DEFAULT_MATCH_FILTER);
  const [sort, setSort] = useState<MatchSort>(DEFAULT_MATCH_SORT);

  // The نوع facet still has no backing field (`matchType` isn't on the card, and
  // رقابتی is refused by the API anyway), and levels only narrow a match that
  // has one. Everything else here narrows for real.
  const visibleMatches = useMemo(() => {
    let list = selectedDay ? matchList.filter((m) => m.day === selectedDay) : matchList;
    if (filter.status.length > 0) list = list.filter((m) => filter.status.includes(m.status));
    // امروز / این هفته / این ماه, in the Jalali calendar the user is reading —
    // several facets at once mean "any of these", so the widest range wins.
    if (filter.date.length > 0) {
      const ranges = filter.date.map((f) => dateFacetRange(f as "today" | "week" | "month"));
      list = list.filter((m) => ranges.some((r) => m.day >= r.start && m.day <= r.end));
    }
    // A match with no level can't be judged against a level facet, so it stays
    // visible rather than being filtered out. `String(undefined)` matched none
    // of "1".."6", so picking any level emptied the whole list of API matches.
    if (filter.levels.length > 0)
      list = list.filter(
        (m) => m.avgLevel === undefined || filter.levels.includes(String(m.avgLevel)),
      );
    // Soonest or latest first. `startMs` is the real Tehran start, so two
    // matches on the same afternoon order correctly.
    if (sort.date)
      list = [...list].sort((a, b) =>
        sort.date === "near" ? a.startMs - b.startMs : b.startMs - a.startMs,
      );
    if (sort.fee)
      // A match with no price (every API match — there is no such field) sorts as free.
      list = [...list].sort((a, b) =>
        sort.fee === "least" ? (a.price ?? 0) - (b.price ?? 0) : (b.price ?? 0) - (a.price ?? 0),
      );
    return list;
  }, [matchList, selectedDay, filter, sort]);

  return (
    <div className="w-full hero-page hero-page-dates">
      <MatchesHeader
        days={days}
        selectedId={selectedDay}
        onSelect={(id) => setSelectedDay((cur) => (cur === id ? "" : id))}
        onFilter={() => setSheet("filter")}
        onSort={() => setSheet("sort")}
      />

      <div className="px-4 py-6 flex flex-col gap-3">
        {matchList.length === 0 && !isLoading ? (
          <EmptyMatches />
        ) : (
          <>
            {visibleMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
            {visibleMatches.length === 0 && matchList.length > 0 && (
              <p className="text-sm text-muted text-center py-10" dir="rtl">
                {selectedDay ? "مَچی برای این روز پیدا نشد." : "مَچی با این فیلترها پیدا نشد."}
              </p>
            )}
          </>
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
