import SubPageLayout from "../_components/SubPageLayout";
import NavRow from "../_components/NavRow";

const items = [
  { label: "انتخاب زبان", href: "/profile/settings/language" },
  { label: "تغییر شهر و استان", href: "/profile/settings/city" },
  { label: "حریم شخصی", href: "/profile/settings/privacy" },
  { label: "پاک کردن اکانت", href: "/profile/settings/delete-account" },
];

export default function SettingsPage() {
  return (
    <SubPageLayout title="تنظیمات">
      <div className="flex flex-col gap-2 w-full">
        {items.map((item) => (
          <NavRow key={item.href} label={item.label} href={item.href} />
        ))}
      </div>
    </SubPageLayout>
  );
}
