import SubPageLayout from "../_components/SubPageLayout";
import NavRow from "../_components/NavRow";

const items = [
  { label: "اطلاعات فردی", href: "/profile/edit/personal" },
  { label: "شماره موبایل", href: "/profile/edit/phone" },
  { label: "ایمیل", href: "/profile/edit/email" },
  { label: "تغییر پسورد", href: "/profile/edit/password" },
];

export default function EditProfilePage() {
  return (
    <SubPageLayout title="ویرایش حساب کاربری">
      <div className="flex flex-col gap-2 w-full">
        {items.map((item) => (
          <NavRow key={item.href} label={item.label} href={item.href} />
        ))}
      </div>
    </SubPageLayout>
  );
}
