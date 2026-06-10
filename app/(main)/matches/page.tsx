"use client";

import { useState } from "react";
import { matchDays, matchList } from "@/lib/mock";
import MatchesHeader from "./_components/MatchesHeader";
import MatchCard from "./_components/MatchCard";
import SortSheet from "./_components/SortSheet";
import FilterSheet from "./_components/FilterSheet";

type Sheet = "sort" | "filter" | null;

export default function MatchesPage() {
  const [selectedDay, setSelectedDay] = useState("d17");
  const [sheet, setSheet] = useState<Sheet>(null);

  return (
    <div className="w-full min-h-dvh">
      <MatchesHeader
        days={matchDays}
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
