"use client";

import StageDial from "../../[id]/_components/StageDial";
import { CloseIcon } from "../../../(main)/_components/icons";

interface Props {
  subtitle: string;
  /** 1-based current step. */
  step: number;
  total: number;
  onClose: () => void;
}

/** Wizard header: close × (left), title + step subtitle + progress ring (right). */
export default function WizardHeader({ subtitle, step, total, onClose }: Props) {
  return (
    <header className="w-full px-6 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن ساخت مَچ"
        className="size-10 shrink-0 flex items-center justify-center rounded-full bg-white border border-edge text-ink-soft active:opacity-80"
      >
        <CloseIcon className="size-4" />
      </button>
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col items-end gap-1 min-w-0">
          <h1 className="text-lg font-bold leading-6 text-ink" dir="rtl">
            ساخت مَچ
          </h1>
          <span className="text-xs text-muted truncate" dir="rtl">
            {subtitle}
          </span>
        </div>
        <StageDial current={step} total={total} />
      </div>
    </header>
  );
}
