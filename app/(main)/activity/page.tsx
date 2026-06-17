"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActivitySections } from "@/lib/data";
import SportPageHeader from "../_components/SportPageHeader";
import FilterSheet from "../matches/_components/FilterSheet";
import SortSheet from "../matches/_components/SortSheet";
import ActivityCard from "./_components/ActivityCard";
import SectionDivider from "./_components/SectionDivider";

type Sheet = "sort" | "filter" | null;

export default function ActivityPage() {
  const { data: activitySections = [] } = useQuery({
    queryKey: ["activitySections"],
    queryFn: getActivitySections,
  });
  const [sheet, setSheet] = useState<Sheet>(null);

  return (
    <div className="w-full min-h-dvh">
      <SportPageHeader
        title="فعالیت‌ها"
        athleteImage="/images/activity-header.webp"
        onFilter={() => setSheet("filter")}
        onSort={() => setSheet("sort")}
      />

      <div className="flex flex-col gap-6 px-4 py-6">
        {activitySections.map((section, i) => (
          <section key={i} className="flex flex-col gap-3">
            {section.heading && <SectionDivider {...section.heading} />}
            {section.items.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))}
          </section>
        ))}
      </div>

      <SortSheet open={sheet === "sort"} onClose={() => setSheet(null)} />
      <FilterSheet open={sheet === "filter"} onClose={() => setSheet(null)} />
    </div>
  );
}
