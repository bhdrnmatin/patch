interface Props {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

/** Light tile in the اطلاعات grid: icon + muted label on top, bold value below. */
export default function InfoItem({ icon, label, children }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-3 flex flex-col gap-3 items-end min-w-0">
      <div className="w-full flex items-center justify-between gap-2">
        <span className="shrink-0 text-muted">{icon}</span>
        <span className="text-sm leading-4 text-muted truncate" dir="rtl">
          {label}
        </span>
      </div>
      <div className="text-sm font-semibold leading-4 text-ink" dir="rtl">
        {children}
      </div>
    </div>
  );
}
