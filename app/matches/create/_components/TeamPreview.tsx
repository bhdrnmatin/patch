"use client";

import { toPersianDigits } from "../../../../lib/persian";
import type { MatchPlayer, TeammateSlot } from "../../../../lib/types";

interface Props {
  /** Label under "شما", e.g. برگزار کننده / بازیکن. */
  myRoleLabel?: string;
  teammates: [TeammateSlot, TeammateSlot, TeammateSlot];
  players: MatchPlayer[];
}

function Cell({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="h-16 rounded-2xl bg-surface border border-edge flex flex-col items-center justify-center gap-1">
      <span className="text-sm font-bold text-ink-soft" dir="rtl">
        {title}
      </span>
      {subtitle && (
        <span className="text-xs text-muted" dir="rtl">
          {subtitle}
        </span>
      )}
    </div>
  );
}

function EmptyCell({ label }: { label: string }) {
  return (
    <div className="h-16 rounded-2xl border-2 border-dashed border-edge flex items-center justify-center">
      <span className="text-xs text-muted" dir="rtl">
        {label}
      </span>
    </div>
  );
}

/** 2×2 team layout preview: شما + بازیکن ۲ vs بازیکن ۳ + ۴, split by the "تور" (net) divider. */
export default function TeamPreview({ myRoleLabel, teammates, players }: Props) {
  const teammate = (slot: 0 | 1 | 2, label: string) => {
    const t = teammates[slot];
    if (t === null) return <EmptyCell label={label} />;

    if (t.kind === "invite") {
      return <Cell title={toPersianDigits(t.phone)} subtitle="دعوت‌شده" />;
    }

    const player = players[t.index];
    return player ? (
      <Cell title={player.name} subtitle={`لول ${toPersianDigits(String(player.level))}`} />
    ) : (
      <EmptyCell label={label} />
    );
  };

  return (
    <div className="w-full bg-white rounded-group p-3 flex flex-col gap-3 shadow-card">
      <div className="grid grid-cols-2 gap-3" dir="rtl">
        <Cell title="شما" subtitle={myRoleLabel} />
        {teammate(0, "بازیکن ۲")}
      </div>
      <div className="flex items-center gap-3">
        <span className="flex-1 h-px bg-divider" aria-hidden />
        <span className="text-xs text-muted" dir="rtl">
          تور
        </span>
        <span className="flex-1 h-px bg-divider" aria-hidden />
      </div>
      <div className="grid grid-cols-2 gap-3" dir="rtl">
        {teammate(1, "بازیکن ۳")}
        {teammate(2, "بازیکن ۴")}
      </div>
    </div>
  );
}
