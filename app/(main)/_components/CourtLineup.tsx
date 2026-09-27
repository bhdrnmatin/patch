import { toPersianDigits } from "@/lib/persian";
import PlayerMark from "./PlayerMark";

interface Player {
  name: string;
  avatar?: string;
}

interface Props {
  players: Player[];
  capacity: number;
  /** Empty seats can still be taken — they draw as the ball, in lime. */
  open: boolean;
  size?: "card" | "hero";
}

/*
 * Court geometry in metres, straight off a padel court: 20 × 10, the net
 * across the middle, each service line 6.95m from it, and a centre line
 * from the net back to the service line only (not to the wall).
 */
const SERVICE = 6.95;
/* The four places a doubles pair stands, as % of the court: each player in
   the middle of a service box. Right half first — the first team reads first
   in RTL. */
const BOX_X = ((10 + SERVICE / 2) / 20) * 100;
const SEATS = [
  { x: BOX_X, y: 25 },
  { x: BOX_X, y: 75 },
  { x: 100 - BOX_X, y: 25 },
  { x: 100 - BOX_X, y: 75 },
];

const SIZES = {
  card: { mark: 34, label: "text-[11px] max-w-[72px]", frame: "p-1.5 rounded-[20px]", court: "rounded-[14px] aspect-[2.25/1]" },
  hero: { mark: 52, label: "text-[13px] max-w-[96px]", frame: "p-2 rounded-[26px]", court: "rounded-[18px] aspect-[2/1]" },
};

/**
 * The match as it stands on court: a top-down padel court with the confirmed
 * players in their four positions and the empty ones left open.
 *
 * Padel is doubles, so a roster *is* a court — four spots, two a side — and
 * «۳ از ۴ نفر» is a sentence you have to read where an empty box is something
 * you see. It's the one picture the whole app is built around: the heroes are
 * this court's lines at a larger scale.
 *
 * A match bigger than four (آمریکانو, up to 12) rotates partners, so there are
 * no fixed positions past the first court; it shows the first four and a count.
 */
export default function CourtLineup({ players, capacity, open, size = "card" }: Props) {
  const s = SIZES[size];
  const seats = SEATS.map((pos, i) => ({ pos, player: players[i] }));
  const free = Math.max(0, capacity - players.length);
  const summary = [
    players.map((p) => p.name).join("، "),
    free > 0 ? `${toPersianDigits(String(free))} جای خالی` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div role="img" aria-label={`بازیکنان: ${summary}`} className={`w-full bg-court-deep ${s.frame}`}>
      <div
        dir="ltr"
        className={`relative w-full overflow-hidden bg-primary ${s.court}`}
        // Mowing stripes: eight bands across the length, the way real turf reads.
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 6.25%, transparent 6.25% 12.5%)",
        }}
      >
        <svg
          aria-hidden
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <g stroke="var(--color-line)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke">
            <line x1={100 - SERVICE * 10} y1="0" x2={100 - SERVICE * 10} y2="100" vectorEffect="non-scaling-stroke" />
            <line x1={100 + SERVICE * 10} y1="0" x2={100 + SERVICE * 10} y2="100" vectorEffect="non-scaling-stroke" />
            <line x1={100 - SERVICE * 10} y1="50" x2={100 + SERVICE * 10} y2="50" vectorEffect="non-scaling-stroke" />
          </g>
          {/* The net: a shadow to the left, the tape on top. */}
          <line x1="101.2" y1="0" x2="101.2" y2="100" stroke="rgba(0,37,77,0.25)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="100" y2="100" stroke="white" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>

        {seats.map(({ pos, player }, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {player ? (
              <PlayerMark
                name={player.name}
                avatar={player.avatar}
                size={s.mark}
                className="ring-2 ring-white shadow-[0_4px_10px_rgba(0,37,77,0.35)]"
              />
            ) : open ? (
              // An open seat is the ball: lime, and the one thing on the court
              // asking for you.
              <span
                style={{ width: s.mark, height: s.mark }}
                className="rounded-full bg-accent text-ink flex items-center justify-center shadow-[0_4px_10px_rgba(0,37,77,0.3)]"
              >
                <svg width="40%" height="40%" viewBox="0 0 12 12" aria-hidden>
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            ) : (
              <span
                style={{ width: s.mark, height: s.mark }}
                className="rounded-full border-[1.5px] border-dashed border-white/45"
              />
            )}
            {/* Name tags, not bare text: white on the court blue is 2.7:1,
                ink on a white tag is 15:1. A closed empty seat keeps an
                invisible one so every seat centres alike. */}
            <span
              dir="rtl"
              className={`${s.label} truncate rounded-pill px-1.5 py-[3px] leading-none font-bold text-ink ${
                player ? "bg-white" : open ? "bg-accent" : "invisible"
              }`}
            >
              {player ? player.name.split(" ")[0] : "جای خالی"}
            </span>
          </div>
        ))}

        {capacity > 4 && (
          <span
            dir="rtl"
            className="absolute top-2 left-1/2 -translate-x-1/2 rounded-pill bg-ink/75 px-2.5 py-1 text-tiny font-bold leading-none text-white whitespace-nowrap"
          >
            {toPersianDigits(String(players.length))} از {toPersianDigits(String(capacity))} نفر
          </span>
        )}
      </div>
    </div>
  );
}
