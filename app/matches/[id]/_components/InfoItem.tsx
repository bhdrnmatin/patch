interface Props {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

/**
 * Light tile in the اطلاعات grid: icon + muted label on top, bold value below.
 *
 * `dir="ltr"` is deliberate and belongs here rather than at each call site. The
 * grids that hold these tiles have to be `dir="rtl"` so tiles fill from the
 * right and read in the right order — but that would flip `items-end` on this
 * column flex to mean *left*, dropping every value against the wrong edge. The
 * tile pins its own direction so a caller can't get it wrong; the text spans
 * carry `dir="rtl"` for shaping.
 */
export default function InfoItem({ icon, label, children }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-3 flex flex-col gap-3 items-end min-w-0" dir="ltr">
      <div className="w-full flex items-center justify-between gap-2">
        <span className="shrink-0 text-muted">{icon}</span>
        <span className="text-sm leading-4 text-muted truncate" dir="rtl">
          {label}
        </span>
      </div>
      <div className="text-sm font-bold leading-4 text-ink" dir="rtl">
        {children}
      </div>
    </div>
  );
}
