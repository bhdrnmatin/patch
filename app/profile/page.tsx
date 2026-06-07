import BottomNav from "../(main)/_components/BottomNav";
import ProfileHero from "./_components/ProfileHero";
import ProfileAvatar from "./_components/ProfileAvatar";
import ProfileMeta from "./_components/ProfileMeta";
import StatsGrid from "./_components/StatsGrid";
import NavRow from "./_components/NavRow";
import { toPersianDigits } from "../../lib/persian";

const AVATAR_SRC = "https://www.figma.com/api/mcp/asset/e9c5a8c9-d4fc-4db6-a4bf-0f6706a2e3ce";
const BG_SRC = "https://www.figma.com/api/mcp/asset/4967c19e-d229-4f6a-bd55-0d87a026fae0";

const STAT_ICONS = {
  wins: "https://www.figma.com/api/mcp/asset/e4539008-d0a1-4a37-82d9-90311ff5c216",
  matches: "https://www.figma.com/api/mcp/asset/a2027bf5-7aba-49d5-9b6c-a3911543331e",
  partners: "https://www.figma.com/api/mcp/asset/41c40465-b5f7-48e5-ad34-f56e27fe03cd",
  winRate: "https://www.figma.com/api/mcp/asset/4caa25f8-ef67-4285-8966-0dbfdeb3b0d2",
  streak: "https://www.figma.com/api/mcp/asset/a7551a17-1f1c-47e2-9b93-002fbf9fcd4c",
  joinDate: "https://www.figma.com/api/mcp/asset/647f1656-5392-4de9-80e1-a088e2cfd564",
  courts: "https://www.figma.com/api/mcp/asset/5fc517ff-f5a1-4299-8fba-7fc8e7f2bbb8",
  tournaments: "https://www.figma.com/api/mcp/asset/46b49941-e017-4d07-b7c9-6bbc61e5a35a",
};

const NAV_ICONS = {
  edit: "https://www.figma.com/api/mcp/asset/5be6686f-775c-4d7a-926a-adf39ae7146e",
  chart: "https://www.figma.com/api/mcp/asset/ab4c683b-6ccf-4618-b909-eb297a1aad96",
  settings: "https://www.figma.com/api/mcp/asset/29283f33-f8fd-4497-b0f7-a3b2e078d32d",
  support: "https://www.figma.com/api/mcp/asset/cbc5c5ee-b714-4fd7-ad4e-453de56c9a46",
  rules: "https://www.figma.com/api/mcp/asset/13609df6-2a83-4425-8246-4be7d2efefca",
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
    <main className="w-full min-h-dvh bg-white pb-24">
      {/* Hero with avatar overlapping bottom edge */}
      <div className="relative mb-12">
        <ProfileHero bgSrc={BG_SRC} />
        <div className="absolute bottom-0 right-6 translate-y-1/2 z-10">
          <ProfileAvatar src={AVATAR_SRC} />
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 flex flex-col gap-6 items-end">
        {/* Name + username + meta */}
        <div className="flex flex-col gap-1 items-end w-full">
          <div className="flex flex-col items-end">
            <span className="text-[22px] font-bold text-[#253343]" dir="rtl">
              {mockPlayer.name}
            </span>
            <span className="text-xs text-[#6783A0]">{mockPlayer.username}</span>
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
