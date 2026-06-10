import FaqItem from "./FaqItem";
import type { FaqEntry } from "../../../../lib/types";

interface Props {
  faq: FaqEntry[];
}

/** سوالات متداول card with expandable rows. */
export default function FaqSection({ faq }: Props) {
  return (
    <section className="w-full bg-white rounded-3xl p-4 flex flex-col items-end gap-4 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.05)]">
      <h2 className="text-lg font-bold leading-6 text-ink" dir="rtl">
        سوالات متداول
      </h2>
      <div className="w-full flex flex-col gap-2">
        {faq.map((f) => (
          <FaqItem key={f.question} question={f.question} answer={f.answer} />
        ))}
      </div>
    </section>
  );
}
