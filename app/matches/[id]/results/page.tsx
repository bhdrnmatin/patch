"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import SubPageLayout from "../../../profile/_components/SubPageLayout";
import GameCard, { type GameEntry } from "./_components/GameCard";
import PlayerPickerSheet from "./_components/PlayerPickerSheet";
import MatchCtaBar from "../_components/MatchCtaBar";
import { getMatchDetails } from "@/lib/data";
import { resultFailureText, submitMatchResult } from "@/lib/api/matches";
import { ApiError } from "@/lib/api/client";

/** Which slot the picker sheet is currently filling. */
interface PickerTarget {
  team: 0 | 1;
  slot: 0 | 1;
}

/**
 * ثبت نتایج — one result per match, because that is what the API takes: two
 * teams and their sets. It used to collect any number of games, each with its
 * own pairing, which `POST /matches/{id}/result` has nowhere to put.
 */
function ResultsContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: m } = useSuspenseQuery({
    queryKey: ["matchDetails", id],
    queryFn: () => getMatchDetails(id),
  });

  const [game, setGame] = useState<GameEntry>({
    teams: [
      [null, null],
      [null, null],
    ],
    sets: [[0, 0]],
  });
  const [picker, setPicker] = useState<PickerTarget | null>(null);

  const pickerSelected = picker ? game.teams[picker.team][picker.slot] : null;
  // Everyone already placed, except the target slot's own player (kept
  // selectable so tapping them clears the slot).
  const pickerDisabled = game.teams
    .flat()
    .filter((v): v is number => v !== null && v !== pickerSelected);

  const handleSelect = (playerIndex: number) => {
    if (!picker) return;
    const { team, slot } = picker;
    setGame((g) => {
      const teams = g.teams.map((t) => [...t]) as GameEntry["teams"];
      teams[team][slot] = teams[team][slot] === playerIndex ? null : playerIndex;
      return { ...g, teams };
    });
    setPicker(null);
  };

  // Account ids per team. A slot left empty is fine — tennis singles is 1v1 —
  // but each team needs someone, which is also all the API insists on.
  const teamIds = game.teams.map((t) =>
    t.map((i) => (i === null ? undefined : m.players[i]?.accountId)).filter((a) => a !== undefined),
  );
  const ready = teamIds.every((t) => t.length > 0);

  const submit = useMutation({
    mutationFn: () =>
      submitMatchResult(id, {
        teamAParticipantIds: teamIds[0],
        teamBParticipantIds: teamIds[1],
        sets: game.sets.map(([a, b]) => ({ teamAScore: a, teamBScore: b })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchDetails", id] });
      router.push(`/matches/${id}`);
    },
  });

  return (
    <SubPageLayout title="ثبت نتایج">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted text-right" dir="rtl">
          {m.title} · {m.format}
        </p>

        <GameCard
          game={game}
          players={m.players}
          onPickSlot={(team, slot) => setPicker({ team, slot })}
          onSetChange={(set, team, value) =>
            setGame((prev) => {
              const sets = prev.sets.map((s) => [...s] as (typeof prev.sets)[number]);
              sets[set][team] = value;
              return { ...prev, sets };
            })
          }
          onAddSet={() => setGame((prev) => ({ ...prev, sets: [...prev.sets, [0, 0]] }))}
          onRemoveSet={(set) =>
            setGame((prev) => ({ ...prev, sets: prev.sets.filter((_, i) => i !== set) }))
          }
        />

        {submit.isError && (
          <p role="alert" className="text-xs text-danger-deep text-right" dir="rtl">
            {submit.error instanceof ApiError
              ? resultFailureText(submit.error.message)
              : "ثبت نتیجه انجام نشد. دوباره تلاش کن."}
          </p>
        )}

        {/* clearance for the fixed CTA bar */}
        <div className="h-[calc(6rem+var(--safe-b))]" aria-hidden />
      </div>

      <MatchCtaBar
        label={submit.isPending ? "در حال ثبت…" : "ثبت نهایی نتایج"}
        caption={ready ? "بازیکنان مَچ نتیجه را تایید یا رد می‌کنند" : "برای هر تیم دست‌کم یک بازیکن انتخاب کن"}
        busy={submit.isPending}
        disabled={!ready}
        onClick={() => submit.mutate()}
      />

      <PlayerPickerSheet
        open={picker !== null}
        players={m.players}
        disabled={pickerDisabled}
        selected={pickerSelected}
        onSelect={handleSelect}
        onClose={() => setPicker(null)}
      />
    </SubPageLayout>
  );
}

export default function MatchResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}
