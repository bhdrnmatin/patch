"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "./icons";

interface Props {
  question: string;
  answer: string;
}

/** Expandable FAQ row: question + chevron, answer revealed on tap. */
export default function FaqItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false);
  const answerId = useId();

  return (
    <div className="w-full bg-white border border-surface rounded-[28px] shadow-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? answerId : undefined}
        className="w-full flex items-center justify-between pl-4 pr-3 py-2"
      >
        <ChevronDownIcon
          className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
        />
        <span className="text-xs leading-6 text-ink-soft text-right" dir="rtl">
          {question}
        </span>
      </button>
      {open && (
        <p id={answerId} className="px-4 pb-3 text-xs leading-5 text-muted text-right" dir="rtl">
          {answer}
        </p>
      )}
    </div>
  );
}
