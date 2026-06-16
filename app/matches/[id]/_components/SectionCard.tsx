import { InfoIcon } from "../../../(main)/_components/icons";

interface Props {
  title: string;
  children: React.ReactNode;
}

/** White rounded card with a blue icon-circle + title header (اطلاعات / توضیحات). */
export default function SectionCard({ title, children }: Props) {
  return (
    <section className="w-full bg-white rounded-3xl p-3 flex flex-col gap-4 shadow-card">
      <div className="flex items-center justify-end gap-3">
        <h2 className="text-lg font-bold text-ink leading-6" dir="rtl">
          {title}
        </h2>
        <span className="size-8 shrink-0 flex items-center justify-center rounded-full bg-primary text-white">
          <InfoIcon className="size-6" />
        </span>
      </div>
      {children}
    </section>
  );
}
