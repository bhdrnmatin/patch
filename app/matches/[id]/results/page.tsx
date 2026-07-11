"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import SubPageLayout from "../../../profile/_components/SubPageLayout";
import GameCard, { type GameEntry } from "./_components/GameCard";
import PlayerPickerSheet from "./_components/PlayerPickerSheet";
import MatchCtaBar from "../_components/MatchCtaBar";
import { getMatchDetails } from "@/lib/data";
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

function ResultsContent() {
  const { id } = useParams<{ id: string }>();
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

  const completeCount = games.filter((g) => g.teams.flat().every((v) => v !== null)).length;

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

        {/* clearance for the fixed CTA bar */}
        <div className="h-24" aria-hidden />
      </div>

      <MatchCtaBar
        label="ثبت نهایی نتایج"
        caption={`${toPersianDigits(String(completeCount))} از ${toPersianDigits(
          String(games.length),
        )} بازی کامل شده است`}
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
