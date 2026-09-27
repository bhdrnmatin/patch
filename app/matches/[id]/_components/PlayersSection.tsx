"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import PlayerChip from "./PlayerChip";
import CourtLineup from "../../../(main)/_components/CourtLineup";
import { toPersianDigits } from "@/lib/persian";
import { removePlayer } from "@/lib/data";
import type { MatchPlayer } from "../../../../lib/types";

interface Props {
  players: MatchPlayer[];
  /** Needed to remove anyone; without it the chips carry no ✕. */
  matchId?: string;
  /** Organizer only — the server enforces it too. */
  canRemove?: boolean;
  capacity: number;
  /** Empty seats can still be taken (an upcoming match). */
  open: boolean;
}

/**
 * بازیکنان: the court with everyone in their place (`CourtLineup`), and —
 * for the organizer — the roster as chips they can remove from.
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
export default function PlayersSection({ players, matchId, canRemove, capacity, open }: Props) {
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
      <div className="w-full flex items-baseline justify-between">
        <span className="text-xs text-muted" dir="rtl">
          {toPersianDigits(String(players.length))} از {toPersianDigits(String(capacity))} نفر
        </span>
        <h2 className="font-display text-[22px] leading-none text-ink" dir="rtl">
          بازیکنان
        </h2>
      </div>

      <CourtLineup players={players} capacity={capacity} open={open} size="hero" />

      {/* The organizer's roster, to remove someone before kick-off. The court
          above can't carry a ✕ per seat without crowding the faces. */}
      {canRemove && players.some((p) => p.participantId && !p.isOrganizer) && (
        <>
          <h3 className="mt-2 text-sm font-bold text-ink-soft text-right" dir="rtl">
            مدیریت بازیکنان
          </h3>
          {/* `dir="rtl"` reverses the inline axis so each row fills from the right.
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
        </>
      )}
      {/* Without this a failed removal just un-dimmed the chip — indistinguishable
          from a refetch that hasn't landed yet. */}
      {isError && (
        <p role="alert" className="text-xs text-danger-deep text-right" dir="rtl">
          حذف بازیکن انجام نشد. دوباره تلاش کن.
        </p>
      )}
    </section>
  );
}
