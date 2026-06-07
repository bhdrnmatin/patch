import SubPageLayout from "../_components/SubPageLayout";
import NavRow from "../_components/NavRow";

const items = [
  { label: "سوالات متداول", href: "/profile/support/faq" },
  { label: "گزارش خطا، مشکل", href: "/profile/support/report" },
  { label: "تماس با پشتیبانی", href: "/profile/support/contact" },
];

export default function SupportPage() {
  return (
    <SubPageLayout title="پشتیبانی">
      <div className="flex flex-col gap-2 w-full">
        {items.map((item) => (
          <NavRow key={item.href} label={item.label} href={item.href} />
        ))}
      </div>
    </SubPageLayout>
  );
}
