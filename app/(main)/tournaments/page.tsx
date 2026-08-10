"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMatchDays, getTournamentList } from "@/lib/data";
import SportPageHeader from "../_components/SportPageHeader";
import FilterSheet, {
  DEFAULT_MATCH_FILTER,
  type MatchFilter,
} from "../matches/_components/FilterSheet";
import SortSheet, { DEFAULT_MATCH_SORT, type MatchSort } from "../matches/_components/SortSheet";
import TournamentCard from "./_components/TournamentCard";

type Sheet = "sort" | "filter" | null;

export default function TournamentsPage() {
  const { data: days = [] } = useQuery({ queryKey: ["matchDays"], queryFn: getMatchDays });
  const { data: tournamentList = [] } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournamentList,
  });
  const [selectedDay, setSelectedDay] = useState("d17");
  const [sheet, setSheet] = useState<Sheet>(null);
  // Sheets are controlled now; tournament cards don't consume these yet
  // (TournamentListItem lacks the filterable fields — see TODO.md).
  const [filter, setFilter] = useState<MatchFilter>(DEFAULT_MATCH_FILTER);
  const [sort, setSort] = useState<MatchSort>(DEFAULT_MATCH_SORT);

  return (
    <div className="w-full min-h-dvh">
      <SportPageHeader
        title="تورنمنت"
        athleteImage="/images/tournaments-header.webp"
        bgImage={null}
        days={days}
        selectedId={selectedDay}
        onSelect={setSelectedDay}
        onFilter={() => setSheet("filter")}
        onSort={() => setSheet("sort")}
      />

      <div className="px-6 py-6 flex flex-col gap-4">
        {tournamentList.map((t) => (
          <TournamentCard key={t.id} tournament={t} />
        ))}
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
