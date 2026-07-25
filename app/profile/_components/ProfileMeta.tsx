interface Props {
  city: string;
  gender: string;
  // Hidden for now — no real data yet:
  // side: string;
  // level: string | number;
}

function Divider() {
  return <div className="w-px h-2 bg-muted shrink-0" />;
}

function MetaItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      <span
        className={`text-xs font-bold ${highlight ? "text-primary" : "text-ink-soft"}`}
      >
        {value}
      </span>
      <span className="text-xs text-muted"> : {label}</span>
    </div>
  );
}

export default function ProfileMeta({ city, gender }: Props) {
  return (
    <div className="flex items-center gap-3" dir="rtl">
      {/* Hidden for now — no real data yet:
      <MetaItem label="لول" value={String(level)} highlight />
      <Divider /> */}
      <MetaItem label="شهر" value={city} />
      <Divider />
      <MetaItem label="جنسیت" value={gender} />
      {/* Hidden for now — no real data yet:
      <Divider />
      <MetaItem label="ساید ترجیحی" value={side} /> */}
    </div>
  );
}
