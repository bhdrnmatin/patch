import BottomNav from "../(main)/_components/BottomNav";
import ProfileHero from "./_components/ProfileHero";
import ProfileAvatar from "./_components/ProfileAvatar";
import ProfileMeta from "./_components/ProfileMeta";
import StatsGrid from "./_components/StatsGrid";
import NavRow from "./_components/NavRow";
import { toPersianDigits } from "../../lib/persian";

const AVATAR_SRC = "/images/avatar-placeholder.svg";

const STAT_ICONS = {
  wins: "/icons/stat-wins.svg",
  matches: "/icons/stat-matches.svg",
  partners: "/icons/stat-partners.svg",
  winRate: "/icons/stat-win-rate.svg",
  streak: "/icons/stat-streak.svg",
  joinDate: "/icons/stat-join-date.svg",
  courts: "/icons/stat-courts.svg",
  tournaments: "/icons/stat-tournaments.svg",
};

const NAV_ICONS = {
  edit: "/icons/nav-edit.svg",
  chart: "/icons/nav-chart.svg",
  settings: "/icons/nav-settings.svg",
  support: "/icons/nav-support.svg",
  rules: "/icons/nav-rules.svg",
};

const mockPlayer = {
  name: "سینا عشاقی",
  username: "@sinaoshaghi",
  city: "تهران",
  side: "راست",
  level: toPersianDigits("4"),
};

const stats = [
  { icon: STAT_ICONS.wins, label: "برد‌ها", value: toPersianDigits("43") },
  { icon: STAT_ICONS.matches, label: "مسابقه‌ها", value: toPersianDigits("32") },
  { icon: STAT_ICONS.partners, label: "یار بازی", value: toPersianDigits("56") },
  { icon: STAT_ICONS.winRate, label: "نرخ برد", value: toPersianDigits("32") + "٪" },
  { icon: STAT_ICONS.streak, label: "برد پشت سرهم", value: toPersianDigits("12") },
  { icon: STAT_ICONS.joinDate, label: "تاریخ عضویت", value: "۲ بهمن ۱۴۰۴" },
  { icon: STAT_ICONS.courts, label: "زمین رزرو شده", value: toPersianDigits("43") },
  { icon: STAT_ICONS.tournaments, label: "تورنومنت", value: toPersianDigits("23") },
];

const navItems = [
  { label: "ویرایش حساب کاربری", href: "/profile/edit", icon: NAV_ICONS.edit },
  { label: "مشاهده آمار", href: "/profile/statistics", icon: NAV_ICONS.chart },
  { label: "تنظیمات", href: "/profile/settings", icon: NAV_ICONS.settings },
  { label: "پشتیبانی", href: "/profile/support", icon: NAV_ICONS.support },
  { label: "قوانین و مقررات", href: "/profile/rules", icon: NAV_ICONS.rules },
];

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-[430px] min-h-dvh bg-white pb-24">
      {/* Hero with avatar overlapping bottom edge */}
      <div className="relative mb-12">
        <ProfileHero />
        <div className="absolute bottom-0 right-6 translate-y-1/2 z-10">
          <ProfileAvatar src={AVATAR_SRC} />
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 flex flex-col gap-6 items-end">
        {/* Name + username + meta */}
        <div className="flex flex-col gap-1 items-end w-full">
          <div className="flex flex-col items-end">
            <span className="text-[22px] font-bold text-ink-soft" dir="rtl">
              {mockPlayer.name}
            </span>
            <span className="text-xs text-ink-soft">{mockPlayer.username}</span>
          </div>
          <ProfileMeta
            city={mockPlayer.city}
            side={mockPlayer.side}
            level={mockPlayer.level}
          />
        </div>

        {/* Stats */}
        <StatsGrid stats={stats} />

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
