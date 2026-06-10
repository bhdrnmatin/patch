interface Props {
  icon: string;
  label: string;
  value: string;
}

export default function StatCard({ icon, label, value }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-3 flex flex-col gap-3 items-end flex-1 min-w-0">
      <div className="flex items-center justify-between w-full">
        <img src={icon} alt="" className="size-5 shrink-0" aria-hidden />
        <span className="text-sm text-muted" dir="rtl">
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold leading-4 text-ink" dir="rtl">
        {value}
      </span>
    </div>
  );
}
