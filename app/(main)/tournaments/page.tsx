"use client";

import { useState } from "react";
import { matchDays, tournamentList } from "@/lib/mock";
import SportPageHeader from "../_components/SportPageHeader";
import FilterSheet from "../matches/_components/FilterSheet";
import SortSheet from "../matches/_components/SortSheet";
import TournamentCard from "./_components/TournamentCard";

type Sheet = "sort" | "filter" | null;

export default function TournamentsPage() {
  const [selectedDay, setSelectedDay] = useState("d17");
  const [sheet, setSheet] = useState<Sheet>(null);

  return (
    <div className="w-full min-h-dvh">
      <SportPageHeader
        title="تورنمنت"
        athleteImage="/images/tournaments-header.webp"
        days={matchDays}
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

      <SortSheet open={sheet === "sort"} onClose={() => setSheet(null)} />
      <FilterSheet open={sheet === "filter"} onClose={() => setSheet(null)} />
    </div>
  );
}
