import { useEffect, useState } from "react";
import { CloseIcon } from "../../../(main)/_components/icons";
import { toPersianDigits } from "../../../../lib/persian";
import type { MatchPlayer } from "../../../../lib/types";

interface Props {
  player: MatchPlayer;
  /** Organizer only. Absent on a chip nobody may remove — including their own. */
  onRemove?: () => void;
  removing?: boolean;
  /** Another chip's removal is in flight — one at a time. */
  locked?: boolean;
}

/**
 * White card chip: avatar on the right, name + level on the left (RTL).
 *
 * `dir="ltr"` is pinned on purpose. The chip sits in an `dir="rtl"` grid so the
 * roster fills right-to-left, and that direction is inherited — which would flip
 * `justify-end` to the left and swap the avatar to the wrong side. The grid
 * needs RTL for its column order; this box needs LTR for its alignment
 * utilities. Both are true at once, hence the pin.
 */
export default function PlayerChip({ player, onRemove, removing, locked }: Props) {
  // Removing someone is irreversible for *them*, so it asks twice — the same
  // rule as ShareCard's link reset, and the same 4s disarm (iOS never blurs a
  // tapped button, so a blur can't be what cancels it).
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <div
      dir="ltr"
      className="relative bg-white border border-white/15 rounded-2xl pl-3 pr-2 py-2 flex items-center justify-end gap-2 shadow-card"
    >
      {onRemove && (
        // Small glyph, 44px hit area: it sits on a chip, and a mis-tap here
        // throws someone out of a match.
        <button
          type="button"
          onClick={() => setArmed(true)}
          disabled={removing || locked}
          aria-label={`حذف ${player.name} از مَچ`}
          className="absolute -top-2 -left-2 size-11 flex items-center justify-center active:opacity-70 disabled:opacity-40"
        >
          <span className="size-5 rounded-full bg-surface border border-edge text-muted flex items-center justify-center shadow-card">
            <CloseIcon className="size-3" />
          </span>
        </button>
      )}
      {/* The confirm covers the whole chip: a big, unmistakable second target,
          and it hides the ✕ so the two taps can't land on the same spot. */}
      {onRemove && (armed || removing) && (
        <button
          type="button"
          onClick={() => {
            setArmed(false);
            onRemove();
          }}
          disabled={removing}
          aria-busy={removing}
          aria-live="polite"
          className="absolute inset-0 z-10 rounded-2xl bg-danger-deep px-2 text-white text-xs font-bold leading-4 text-center flex items-center justify-center active:opacity-80 disabled:opacity-40"
          dir="rtl"
        >
          {removing ? "در حال حذف…" : `حذف ${player.name}؟ دوباره بزن`}
        </button>
      )}
      <div className="flex flex-col items-end gap-2 min-w-0">
        <span className="text-xs font-bold leading-[11px] text-ink-soft truncate" dir="rtl">
          {player.name}
        </span>
        {/* Levels arrive after the MVP, so an API player has none — printing
            «لول undefined» is what an unguarded String() would give. */}
        {player.level !== undefined && (
          <span className="text-xs leading-[11px] text-ink-soft/50" dir="rtl">
            لول {toPersianDigits(String(player.level))}
          </span>
        )}
      </div>
      <img
        src={player.avatar ?? "/images/avatar-placeholder.svg"}
        alt=""
        className="size-10 shrink-0 rounded-full bg-edge object-cover"
      />
    </div>
  );
}
