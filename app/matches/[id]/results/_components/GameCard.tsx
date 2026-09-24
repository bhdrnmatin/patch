"use client";

import PlayerSlotButton from "./PlayerSlotButton";
import ScoreStepper from "./ScoreStepper";
import { CloseIcon } from "../../../../(main)/_components/icons";
import { toPersianDigits } from "../../../../../lib/persian";
import type { MatchPlayer } from "../../../../../lib/types";

/** One team's two slots — values are indexes into the match players, null = empty. */
export type TeamSlots = [number | null, number | null];

/** One set's scores: [team 1, team 2]. */
export type SetScores = [number, number];

/**
 * Client-side state of the match's result. One per match — that is all the
 * API takes (`POST /matches/{id}/result`: two teams and the sets), so the
 * multi-game «+ افزودن بازی» flow is gone (user, 2026-09-24).
 */
export interface GameEntry {
  teams: [TeamSlots, TeamSlots];
  sets: SetScores[];
}

interface Props {
  game: GameEntry;
  players: MatchPlayer[];
  onPickSlot: (team: 0 | 1, slot: 0 | 1) => void;
  onSetChange: (set: number, team: 0 | 1, value: number) => void;
  onAddSet: () => void;
  onRemoveSet: (set: number) => void;
}

const TEAM_LABELS = ["تیم ۱", "تیم ۲"] as const;

/** The result card: two team columns (2 player slots each) + a list of sets with score steppers. */
export default function GameCard({
  game,
  players,
  onPickSlot,
  onSetChange,
  onAddSet,
  onRemoveSet,
}: Props) {
  const renderTeam = (team: 0 | 1) => (
    <div className="flex-1 min-w-0 flex flex-col gap-2">
      <span className="text-center text-xs font-bold text-muted" dir="rtl">
        {TEAM_LABELS[team]}
      </span>
      {([0, 1] as const).map((slot) => {
        const playerIndex = game.teams[team][slot];
        return (
          <PlayerSlotButton
            key={slot}
            player={playerIndex === null ? undefined : players[playerIndex]}
            slotLabel={TEAM_LABELS[team]}
            onClick={() => onPickSlot(team, slot)}
          />
        );
      })}
    </div>
  );

  return (
    <section className="w-full bg-white rounded-group p-3 flex flex-col gap-3 shadow-card">
      {/* dir=rtl puts تیم ۱ on the right; columns center their content, so the
          RTL justify/items-end trap doesn't apply here. */}
      <div className="flex items-stretch gap-3" dir="rtl">
        {renderTeam(0)}
        <div className="w-px bg-divider" aria-hidden />
        {renderTeam(1)}
      </div>

      <div className="h-px bg-divider" aria-hidden />

      <div className="flex flex-col gap-3">
        {game.sets.map((scores, i) => {
          const setNo = toPersianDigits(String(i + 1));
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {game.sets.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => onRemoveSet(i)}
                    aria-label={`حذف ست ${setNo}`}
                    className="size-8 flex items-center justify-center rounded-full border border-white/15 bg-black/[0.08] text-ink-soft active:opacity-80"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                ) : (
                  <span className="size-8" aria-hidden />
                )}
                <span className="text-xs font-bold text-muted" dir="rtl">
                  ست {setNo}
                </span>
              </div>
              {/* Steppers split 50/50 so each sits under its team column. */}
              <div className="flex gap-2" dir="rtl">
                {([0, 1] as const).map((team) => (
                  <div key={team} className="flex-1 flex justify-center">
                    <ScoreStepper
                      label={`${TEAM_LABELS[team]} در ست ${setNo}`}
                      value={scores[team]}
                      onChange={(value) => onSetChange(i, team, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={onAddSet}
                    className="w-full h-11 rounded-pill border border-dashed border-primary/40 text-primary text-sm font-bold active:opacity-80"
          dir="rtl"
        >
          + افزودن ست
        </button>
      </div>
    </section>
  );
}
