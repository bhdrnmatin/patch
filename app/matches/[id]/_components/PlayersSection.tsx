"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import PlayerChip from "./PlayerChip";
import { removePlayer } from "@/lib/data";
import type { MatchPlayer } from "../../../../lib/types";

interface Props {
  players: MatchPlayer[];
  /** Needed to remove anyone; without it the chips carry no ✕. */
  matchId?: string;
  /** Organizer only — the server enforces it too. */
  canRemove?: boolean;
}

/**
 * بازیکنان header + 2-column grid of player chips.
 *
 * The organizer can remove a player here — `DELETE /matches/{id}/participants/
 * {participantId}`, the endpoint that existed from the start and was never
 * called. Not their own chip: the server refuses that and says to cancel the
 * match instead.
 *
 * The «همه» link this header used to carry is gone with the other dead buttons:
 * it had no `onClick` and no roster page to open, and a four-player grid shows
 * everyone anyway.
 */
export default function PlayersSection({ players, matchId, canRemove }: Props) {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, variables } = useMutation({
    mutationFn: (participantId: string) => removePlayer(matchId!, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchDetails", matchId] });
      // The roster count is on the list card too.
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });

  return (
    <section className="w-full flex flex-col gap-3">
      <div className="w-full flex items-center justify-end">
        <h2 className="text-base font-bold leading-4 text-ink-soft" dir="rtl">
          بازیکنان
        </h2>
      </div>
      {/* `dir="rtl"` reverses the inline axis so each row fills from the right.
          With an odd roster the last chip then sits in the right column with the
          gap on its left, instead of starting a row on the wrong side.
          `PlayerChip` pins `dir="ltr"` so its own alignment is unaffected. */}
      <ul className="grid grid-cols-2 gap-3" dir="rtl">
        {players.map((p, i) => {
          const removable = canRemove && matchId && p.participantId && !p.isOrganizer;
          return (
            <li key={p.participantId ?? i}>
              <PlayerChip
                player={p}
                onRemove={removable ? () => mutate(p.participantId!) : undefined}
                removing={isPending && variables === p.participantId}
                // A second removal mid-flight would replace `variables` and
                // strip the first chip of its busy state.
                locked={isPending}
              />
            </li>
          );
        })}
      </ul>
      {/* Without this a failed removal just un-dimmed the chip — indistinguishable
          from a refetch that hasn't landed yet. */}
      {isError && (
        <p role="alert" className="text-xs text-danger text-right" dir="rtl">
          حذف بازیکن انجام نشد. دوباره تلاش کن.
        </p>
      )}
    </section>
  );
}
