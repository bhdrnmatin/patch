import BottomNav from "../(main)/_components/BottomNav";
import ProfileHero from "./_components/ProfileHero";
import ProfileIdentity from "./_components/ProfileIdentity";
// import StatsGrid from "./_components/StatsGrid"; // hidden until real stats exist
import NavRow from "./_components/NavRow";
import { toPersianDigits } from "../../lib/persian";

// Stat-card icons — unused while the stats grid is hidden (mock-only for launch).
// const STAT_ICONS = {
//   wins: "/icons/stat-wins.svg",
//   matches: "/icons/stat-matches.svg",
//   partners: "/icons/stat-partners.svg",
//   winRate: "/icons/stat-win-rate.svg",
//   streak: "/icons/stat-streak.svg",
//   joinDate: "/icons/stat-join-date.svg",
//   courts: "/icons/stat-courts.svg",
//   tournaments: "/icons/stat-tournaments.svg",
// };

const NAV_ICONS = {
  edit: "/icons/nav-edit.svg",
  chart: "/icons/nav-chart.svg",
  settings: "/icons/nav-settings.svg",
  support: "/icons/nav-support.svg",
  rules: "/icons/nav-rules.svg",
};

const mockPlayer = {
  name: "سینا عشاقی",
  city: "تهران",
  side: "راست",
  level: toPersianDigits("4"),
};

// Stats are mock-only and hidden until the backend provides real data.
// const stats = [
//   { icon: STAT_ICONS.wins, label: "برد‌ها", value: toPersianDigits("43") },
//   { icon: STAT_ICONS.matches, label: "مَچ‌ها", value: toPersianDigits("32") },
//   { icon: STAT_ICONS.partners, label: "یار بازی", value: toPersianDigits("56") },
//   { icon: STAT_ICONS.winRate, label: "نرخ برد", value: toPersianDigits("32") + "٪" },
//   { icon: STAT_ICONS.streak, label: "برد پشت سرهم", value: toPersianDigits("12") },
//   { icon: STAT_ICONS.joinDate, label: "تاریخ عضویت", value: "۲ بهمن ۱۴۰۴" },
//   { icon: STAT_ICONS.courts, label: "زمین رزرو شده", value: toPersianDigits("43") },
//   { icon: STAT_ICONS.tournaments, label: "تورنومنت", value: toPersianDigits("23") },
// ];

const navItems = [
  { label: "ویرایش حساب کاربری", href: "/profile/edit/personal", icon: NAV_ICONS.edit },
  { label: "مشاهده آمار", href: "/profile/statistics", icon: NAV_ICONS.chart, comingSoon: true },
  { label: "تنظیمات", href: "/profile/settings", icon: NAV_ICONS.settings },
  // Hidden for now:
  // { label: "پشتیبانی", href: "/profile/support", icon: NAV_ICONS.support },
  { label: "قوانین و مقررات", href: "/profile/rules", icon: NAV_ICONS.rules },
];

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-[430px] min-h-dvh bg-surface pb-24">
      <ProfileHero />

      {/* Main content — identity overlaps the hero via its own -mt-12 */}
      <div className="px-6 flex flex-col gap-6 items-end">
        {/* Avatar + name (live) + city/gender chips */}
        <ProfileIdentity
          fallbackName={mockPlayer.name}
          city={mockPlayer.city}
          side={mockPlayer.side}
          level={mockPlayer.level}
        />

        {/* Stats hidden until real data exists (mock-only for launch) */}
        {/* <StatsGrid stats={stats} /> */}

        {/* Navigation menu */}
        <div className="flex flex-col gap-2 w-full">
          {navItems.map((item) => (
            <NavRow key={item.href} {...item} />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
