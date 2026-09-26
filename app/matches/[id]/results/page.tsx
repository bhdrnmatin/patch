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
import { toPersianDigits } from "../../../../lib/persian";

const emptyGame = (id: number): GameEntry => ({
  id,
  teams: [
    [null, null],
    [null, null],
  ],
  sets: [[0, 0]],
});

/** Which slot the picker sheet is currently filling. */
interface PickerTarget {
  gameId: number;
  team: 0 | 1;
  slot: 0 | 1;
}

/**
 * ثبت نتایج — any number of games, each with its own pairing (players may swap
 * partners between games, as in آمریکانو). All go up in one `POST …/result`
 * as `games` (the API's shape since 2026-09-26). One game per match was the
 * rule for two days while the API only took one.
 */
function ResultsContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: m } = useSuspenseQuery({
    queryKey: ["matchDetails", id],
    queryFn: () => getMatchDetails(id),
  });

  const [games, setGames] = useState<GameEntry[]>([emptyGame(1)]);
  const [nextId, setNextId] = useState(2);
  const [picker, setPicker] = useState<PickerTarget | null>(null);

  const updateGame = (gameId: number, patch: (g: GameEntry) => GameEntry) =>
    setGames((prev) => prev.map((g) => (g.id === gameId ? patch(g) : g)));

  const addGame = () => {
    setGames((prev) => [...prev, emptyGame(nextId)]);
    setNextId((n) => n + 1);
  };

  const pickerGame = picker ? games.find((g) => g.id === picker.gameId) : undefined;
  const pickerSelected =
    picker && pickerGame ? pickerGame.teams[picker.team][picker.slot] : null;
  // Everyone already placed in this game, except the target slot's own player
  // (kept selectable so tapping them clears the slot).
  const pickerDisabled = pickerGame
    ? pickerGame.teams.flat().filter((v): v is number => v !== null && v !== pickerSelected)
    : [];

  const handleSelect = (playerIndex: number) => {
    if (!picker) return;
    const { gameId, team, slot } = picker;
    updateGame(gameId, (g) => {
      const teams = g.teams.map((t) => [...t]) as GameEntry["teams"];
      teams[team][slot] = teams[team][slot] === playerIndex ? null : playerIndex;
      return { ...g, teams };
    });
    setPicker(null);
  };

  // Account ids per team. The API wants exactly two a side (doubles only,
  // since 2026-09-26), so a game counts as complete with all four slots filled.
  const teamIds = (g: GameEntry) =>
    g.teams.map((t) =>
      t.map((i) => (i === null ? undefined : m.players[i]?.accountId)).filter((a) => a !== undefined),
    );
  const completeCount = games.filter((g) => teamIds(g).every((t) => t.length === 2)).length;
  const ready = completeCount === games.length;

  const submit = useMutation({
    mutationFn: () =>
      submitMatchResult(id, {
        games: games.map((g) => {
          const [a, b] = teamIds(g);
          return {
            teamA: { participantIds: a },
            teamB: { participantIds: b },
            sets: g.sets.map(([x, y]) => ({ teamAScore: x, teamBScore: y })),
          };
        }),
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

        {games.map((g, i) => (
          <GameCard
            key={g.id}
            number={i + 1}
            game={g}
            players={m.players}
            onPickSlot={(team, slot) => setPicker({ gameId: g.id, team, slot })}
            onSetChange={(set, team, value) =>
              updateGame(g.id, (prev) => {
                const sets = prev.sets.map((s) => [...s] as (typeof prev.sets)[number]);
                sets[set][team] = value;
                return { ...prev, sets };
              })
            }
            onAddSet={() =>
              updateGame(g.id, (prev) => ({ ...prev, sets: [...prev.sets, [0, 0]] }))
            }
            onRemoveSet={(set) =>
              updateGame(g.id, (prev) => ({
                ...prev,
                sets: prev.sets.filter((_, i) => i !== set),
              }))
            }
            onRemove={
              games.length > 1
                ? () => setGames((prev) => prev.filter((x) => x.id !== g.id))
                : undefined
            }
          />
        ))}

        <button
          type="button"
          onClick={addGame}
          className="w-full h-12 rounded-pill border-2 border-dashed border-primary/40 text-primary text-sm font-bold active:opacity-80"
          dir="rtl"
        >
          + افزودن بازی
        </button>

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
        caption={
          ready
            ? "بازیکنان مَچ نتیجه را تایید یا رد می‌کنند"
            : `${toPersianDigits(String(completeCount))} از ${toPersianDigits(
                String(games.length),
              )} بازی کامل شده — هر تیم دو بازیکن`
        }
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
