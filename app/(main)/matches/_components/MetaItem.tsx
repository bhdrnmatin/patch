interface Props {
  icon: React.ReactNode;
  label: string;
}

/** Icon + label pair in a match card's meta row (avg level / players / date). */
export default function MetaItem({ icon, label }: Props) {
  return (
    <div className="flex items-center gap-1.5 text-[#253343]" dir="rtl">
      <span className="shrink-0">{icon}</span>
      <span className="text-xs whitespace-nowrap">{label}</span>
    </div>
  );
}
