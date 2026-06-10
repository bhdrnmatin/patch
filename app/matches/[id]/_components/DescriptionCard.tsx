import SectionCard from "./SectionCard";

interface Props {
  text: string;
}

/** توضیحات card: section shell + body copy. */
export default function DescriptionCard({ text }: Props) {
  return (
    <SectionCard title="توضیحات">
      <p className="text-sm leading-relaxed text-ink-soft text-right" dir="rtl">
        {text}
      </p>
    </SectionCard>
  );
}
