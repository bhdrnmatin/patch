import StatCard from "./StatCard";

interface Stat {
  icon: string;
  label: string;
  value: string;
}

interface Props {
  stats: Stat[];
}

export default function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
