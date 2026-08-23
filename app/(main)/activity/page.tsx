"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActivitySections } from "@/lib/data";
import SportPageHeader from "../_components/SportPageHeader";
import FilterSheet, {
  DEFAULT_MATCH_FILTER,
  type MatchFilter,
} from "../matches/_components/FilterSheet";
import SortSheet, { DEFAULT_MATCH_SORT, type MatchSort } from "../matches/_components/SortSheet";
import ActivityCard from "./_components/ActivityCard";
import SectionDivider from "./_components/SectionDivider";
import EmptyActivity from "./_components/EmptyActivity";

type Sheet = "sort" | "filter" | null;

export default function ActivityPage() {
  const { data: activitySections = [], isLoading } = useQuery({
    queryKey: ["activitySections"],
    queryFn: getActivitySections,
  });
  const [sheet, setSheet] = useState<Sheet>(null);
  // Sheets are controlled now; activity cards don't consume these yet (ActivityItem
  // lacks the filterable fields — see TODO.md).
  const [filter, setFilter] = useState<MatchFilter>(DEFAULT_MATCH_FILTER);
  const [sort, setSort] = useState<MatchSort>(DEFAULT_MATCH_SORT);

  return (
    <div className="w-full min-h-dvh">
      <SportPageHeader
        title="فعالیت‌ها"
        onFilter={() => setSheet("filter")}
        onSort={() => setSheet("sort")}
      />

      <div className="flex flex-col gap-6 px-4 py-6">
        {activitySections.length === 0 && !isLoading ? (
          <EmptyActivity />
        ) : (
          activitySections.map((section, i) => (
            <section key={i} className="flex flex-col gap-3">
              {section.heading && <SectionDivider {...section.heading} />}
              {section.items.map((item) => (
                <ActivityCard key={item.id} item={item} />
              ))}
            </section>
          ))
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
