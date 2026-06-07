import SubPageLayout from "../_components/SubPageLayout";
import NavRow from "../_components/NavRow";

const items = [
  { label: "دستاورد‌ها", href: "/profile/statistics/achievements" },
  { label: "سابقه مسابقات", href: "/profile/statistics/matches" },
  { label: "سابقه رزرو‌ها", href: "/profile/statistics/reservations" },
  { label: "دوستان بازیکن", href: "/profile/statistics/friends" },
];

export default function StatisticsPage() {
  return (
    <SubPageLayout title="مشاهده آمار">
      <div className="flex flex-col gap-2 w-full">
        {items.map((item) => (
          <NavRow key={item.href} label={item.label} href={item.href} />
        ))}
      </div>
    </SubPageLayout>
  );
}
