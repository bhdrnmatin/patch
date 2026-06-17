"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMatchDays, getMatchList } from "@/lib/data";
import MatchesHeader from "./_components/MatchesHeader";
import MatchCard from "./_components/MatchCard";
import SortSheet from "./_components/SortSheet";
import FilterSheet from "./_components/FilterSheet";

type Sheet = "sort" | "filter" | null;

export default function MatchesPage() {
  const { data: days = [] } = useQuery({ queryKey: ["matchDays"], queryFn: getMatchDays });
  const { data: matchList = [] } = useQuery({ queryKey: ["matches"], queryFn: getMatchList });
  const [selectedDay, setSelectedDay] = useState("d17");
  const [sheet, setSheet] = useState<Sheet>(null);

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
        {matchList.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>

      <SortSheet open={sheet === "sort"} onClose={() => setSheet(null)} />
      <FilterSheet open={sheet === "filter"} onClose={() => setSheet(null)} />
    </div>
  );
}
