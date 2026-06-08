interface Props {
  city: string;
  side: string;
  level: string | number;
}

function Divider() {
  return <div className="w-px h-2 bg-[#6783A0] shrink-0" />;
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
        className={`text-xs font-bold ${highlight ? "text-primary" : "text-[#57728E]"}`}
      >
        {value}
      </span>
      <span className="text-xs text-[#445A74]">{label}</span>
    </div>
  );
}

export default function ProfileMeta({ city, side, level }: Props) {
  return (
    <div className="flex items-center gap-3" dir="rtl">
      <MetaItem label="ساید ترجیحی:" value={side} />
      <Divider />
      <MetaItem label="شهر:" value={city} />
      <Divider />
      <MetaItem label="لول:" value={String(level)} highlight />
    </div>
  );
}
