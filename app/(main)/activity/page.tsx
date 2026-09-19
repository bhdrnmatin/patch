"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getActivitySections } from "@/lib/data";
import { acceptInvitation } from "@/lib/api/matches";
import type { ActivityAction, ActivityItem } from "@/lib/types";
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
  const queryClient = useQueryClient();
  const router = useRouter();

  // Keyed by the card, so only the tapped one greys out — or shows what the
  // server said — while the rest of the list stays usable.
  const [busyId, setBusyId] = useState<string | null>(null);
  const [failed, setFailed] = useState<{ id: string; message: string } | null>(null);
  const { mutate: acceptInvite } = useMutation({
    mutationFn: (item: ActivityItem) => acceptInvitation(item.id),
    onMutate: (item) => {
      setBusyId(item.id);
      setFailed(null);
    },
    onSettled: () => setBusyId(null),
    // An invitation can stop being answerable while the card sits on screen —
    // joining the match from anywhere else closes it, and the server answers 409
    // «این دعوت‌نامه قبلاً پذیرفته شده است». Silence read as a dead button, so
    // say it on the card and refetch, which drops a card that is no longer real.
    onError: (e, item) => {
      setFailed({ id: item.id, message: e.message || "انجام نشد. دوباره تلاش کنید." });
      queryClient.invalidateQueries({ queryKey: ["activitySections"] });
    },
    onSuccess: (_data, item) => {
      // The invitation is answered, so it leaves this list, and accepting puts
      // the viewer on a roster — the match queries are stale too.
      queryClient.invalidateQueries({ queryKey: ["activitySections"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["matchDetails", item.matchId] });
      router.push(`/matches/${item.matchId}`);
    },
  });

  const onAction = (item: ActivityItem) => (kind: ActivityAction["kind"]) =>
    kind === "open-match" ? router.push(`/matches/${item.matchId}`) : acceptInvite(item);

  const [sheet, setSheet] = useState<Sheet>(null);
  // Sheets are controlled now; activity cards don't consume these yet (ActivityItem
  // lacks the filterable fields — see TODO.md).
  const [filter, setFilter] = useState<MatchFilter>(DEFAULT_MATCH_FILTER);
  const [sort, setSort] = useState<MatchSort>(DEFAULT_MATCH_SORT);

  return (
    <div className="w-full hero-page">
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
                <ActivityCard
                  key={item.id}
                  item={item}
                  busy={busyId === item.id}
                  error={failed?.id === item.id ? failed.message : undefined}
                  onAction={onAction(item)}
                />
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
