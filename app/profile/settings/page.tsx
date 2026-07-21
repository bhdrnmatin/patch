import SubPageLayout from "../_components/SubPageLayout";
import NavRow from "../_components/NavRow";
import LogoutRow from "./_components/LogoutRow";

const items = [
  // Hidden for now — flows don't exist yet:
  // { label: "انتخاب زبان", href: "/profile/settings/language" },
  { label: "تغییر شهر و استان", href: "/profile/settings/city" },
  // { label: "حریم شخصی", href: "/profile/settings/privacy" },
  // Replaced the delete-account row with logout (below).
  // { label: "پاک کردن اکانت", href: "/profile/settings/delete-account" },
];

export default function SettingsPage() {
  return (
    <SubPageLayout title="تنظیمات">
      <div className="flex flex-col gap-2 w-full">
        {items.map((item) => (
          <NavRow key={item.href} label={item.label} href={item.href} />
        ))}
        <LogoutRow />
      </div>
    </SubPageLayout>
  );
}
