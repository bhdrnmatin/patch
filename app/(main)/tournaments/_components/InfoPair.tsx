interface Props {
  label: string;
  value: React.ReactNode;
}

/** RTL `label:` (muted) + `value` (bold) pair in a tournament card's info grid. */
export default function InfoPair({ label, value }: Props) {
  return (
    <div dir="rtl" className="flex items-center gap-[7px] whitespace-nowrap">
      <span className="text-[10px] text-muted">{label}</span>
      <span className="text-xs font-bold text-ink-soft">{value}</span>
    </div>
  );
}
