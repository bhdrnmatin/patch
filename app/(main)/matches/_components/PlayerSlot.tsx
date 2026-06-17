import { toPersianDigits } from "@/lib/persian";

interface Props {
  name: string;
  level: number;
  avatar?: string;
}

/** A single player in a match card's roster grid: avatar + name + level (RTL). */
export default function PlayerSlot({ name, level, avatar }: Props) {
  return (
    <div className="flex items-center gap-2 bg-surface rounded-2xl p-2" dir="rtl">
      <div className="size-10 shrink-0 rounded-full overflow-hidden bg-edge">
        {avatar && <img src={avatar} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[12px] font-semibold leading-[11px] text-ink truncate">{name}</span>
        <span className="text-[11px] leading-none text-muted">
          لول {toPersianDigits(String(level))}
        </span>
      </div>
    </div>
  );
}
