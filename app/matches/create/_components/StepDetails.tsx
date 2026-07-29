"use client";

import { useState } from "react";
import TextField from "./TextField";
import TextArea from "./TextArea";
import SelectField from "./SelectField";
import OptionSheet, { type SheetOption } from "./OptionSheet";
import type { CreateMatchDraft } from "../../../../lib/types";

export const FORMAT_OPTIONS: SheetOption[] = [
  { id: "americano", label: "آمریکانو" },
  { id: "friendly", label: "دوستانه" },
  { id: "competitive", label: "رقابتی" },
];

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
}

/** Step ۱ مشخصات: format select + title + description. */
export default function StepDetails({ draft, patch }: Props) {
  const [formatOpen, setFormatOpen] = useState(false);

  return (
    <>
      <SelectField
        label="حالت بازی"
        value={FORMAT_OPTIONS.find((o) => o.id === draft.format)?.label}
        onClick={() => setFormatOpen(true)}
      />
      <TextField
        label="عنوان مَچ"
        value={draft.title}
        onChange={(title) => patch({ title })}
        placeholder="مثلا راکت طلایی"
      />
      <TextArea
        label="توضیحات"
        value={draft.description}
        onChange={(description) => patch({ description })}
        placeholder="توضیحاتی برای بازیکنان بنویسید..."
      />
      <OptionSheet
        open={formatOpen}
        title="حالت بازی"
        options={FORMAT_OPTIONS}
        value={draft.format}
        onSelect={(id) => {
          patch({ format: id as CreateMatchDraft["format"] });
          setFormatOpen(false);
        }}
        onClose={() => setFormatOpen(false)}
      />
    </>
  );
}
