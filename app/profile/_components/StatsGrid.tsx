import StatCard from "./StatCard";

interface Stat {
  icon: string;
  label: string;
  value: string;
}

interface Props {
  stats: Stat[];
  /** Blur the grid and overlay a "به زودی" layer — real stats aren't available yet. */
  comingSoon?: boolean;
}

export default function StatsGrid({ stats, comingSoon }: Props) {
  const grid = (
    <div
      className={`grid grid-cols-2 gap-3 w-full ${
        comingSoon ? "opacity-80 select-none pointer-events-none" : ""
      }`}
      aria-hidden={comingSoon}
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );

  if (!comingSoon) return grid;

  return (
    <div className="relative w-full">
      {grid}
      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[0.9px] rounded-2xl">
        <span
          className="text-5xl font-bold text-primary/60 tracking-wide -rotate-45 drop-shadow-hero"
          dir="rtl"
        >
          به زودی
        </span>
      </div>
    </div>
  );
}
