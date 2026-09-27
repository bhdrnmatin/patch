interface Props {
  title: string;
  children: React.ReactNode;
}

/** White card with a display-face title (اطلاعات / توضیحات). */
export default function SectionCard({ title, children }: Props) {
  return (
    <section className="w-full bg-white rounded-[24px] p-3 pt-4 flex flex-col gap-3 shadow-card">
      <h2 className="px-1 font-display text-[22px] leading-none text-ink text-right" dir="rtl">
        {title}
      </h2>
      {children}
    </section>
  );
}
