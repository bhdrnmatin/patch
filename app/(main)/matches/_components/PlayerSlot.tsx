import { toPersianDigits } from "@/lib/persian";

interface Props {
  name: string;
  /** Omitted entirely when unknown — the API returns no levels. */
  level?: number;
  avatar?: string;
}

/** A single player in a match card's roster grid: avatar + name + level (RTL).
 *  The level line is dropped when `level` is absent. */
export default function PlayerSlot({ name, level, avatar }: Props) {
  return (
    <div className="flex items-center gap-2 bg-surface rounded-2xl p-2" dir="rtl">
      <div className="size-10 shrink-0 rounded-full overflow-hidden bg-edge">
        {avatar && <img src={avatar} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs font-bold leading-none text-ink truncate">{name}</span>
        {/* No line at all when there is no level — «لول ۰» reads as a real
            rating of zero. Levels arrive after the MVP. */}
        {level !== undefined && (
          <span className="text-xs leading-none text-muted">
            لول {toPersianDigits(String(level))}
          </span>
        )}
      </div>
    </div>
  );
}
