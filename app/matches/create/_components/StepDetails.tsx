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

export const INVITE_OPTIONS: SheetOption[] = [
  { id: "public", label: "عمومی" },
  { id: "private", label: "خصوصی" },
];

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
}

type SheetId = "format" | "invite" | null;

/** Step ۱ مشخصات: format + invite selects, title + description. */
export default function StepDetails({ draft, patch }: Props) {
  const [sheet, setSheet] = useState<SheetId>(null);

  return (
    <>
      <SelectField
        label="حالت بازی"
        value={FORMAT_OPTIONS.find((o) => o.id === draft.format)?.label}
        onClick={() => setSheet("format")}
      />
      <SelectField
        label="نحوه دعوت"
        value={INVITE_OPTIONS.find((o) => o.id === draft.invite)?.label}
        onClick={() => setSheet("invite")}
      />
      <TextField
        label="عنوان مَچ (اختیاری)"
        value={draft.title}
        onChange={(title) => patch({ title })}
        placeholder="مثلا راکت طلایی"
      />
      <TextArea
        label="توضیحات (اختیاری)"
        value={draft.description}
        onChange={(description) => patch({ description })}
        placeholder="توضیحاتی برای بازیکنان بنویسید..."
      />
      <OptionSheet
        open={sheet === "format"}
        title="حالت بازی"
        options={FORMAT_OPTIONS}
        value={draft.format}
        onSelect={(id) => {
          patch({ format: id as CreateMatchDraft["format"] });
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        open={sheet === "invite"}
        title="نحوه دعوت"
        options={INVITE_OPTIONS}
        value={draft.invite}
        onSelect={(id) => {
          patch({ invite: id as CreateMatchDraft["invite"] });
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
    </>
  );
}
