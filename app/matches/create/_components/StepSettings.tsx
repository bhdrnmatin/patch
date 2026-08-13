"use client";

import InfoBanner from "../../[id]/_components/InfoBanner";
import RadioCardGroup, { type RadioCardOption } from "./RadioCardGroup";
import type { CreateMatchDraft } from "../../../../lib/types";

export const JOIN_METHOD_OPTIONS: RadioCardOption[] = [
  {
    id: "open",
    title: "ورود آزاد",
    description: "هر بازیکنی بدون تایید شما وارد مَچ می‌شود.",
    icon: <OpenDoorIcon />,
  },
  {
    id: "invite",
    title: "فقط با دعوت",
    description: "فقط کسانی که لینک دعوت را دارند می‌توانند وارد شوند.",
    icon: <LinkIcon />,
  },
  {
    id: "approval",
    title: "با تایید شما",
    description: "درخواست ورود می‌آید و شما آن را قبول یا رد می‌کنید.",
    icon: <ApprovalIcon />,
  },
];

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
}

/** Step ۵ تنظیمات: how players get in. A private match is link-only, so step ۱
 *  already answered this and the step just says so. */
export default function StepSettings({ draft, patch }: Props) {
  if (draft.invite === "private") {
    return <InfoBanner text="این مَچ خصوصی است، پس ورود فقط با لینک دعوت انجام می‌شود." />;
  }

  return (
    <RadioCardGroup
      label="نحوه ورود بازیکنان"
      subtitle="بازیکنان چطور به این مَچ اضافه شوند؟"
      options={JOIN_METHOD_OPTIONS}
      value={draft.joinMethod}
      onChange={(id) => patch({ joinMethod: id as CreateMatchDraft["joinMethod"] })}
    />
  );
}

function OpenDoorIcon() {
  // Open door — walk straight in.
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 3.5 6 5.5v13l8 2v-17Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 5h4v14h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1.3-1.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ApprovalIcon() {
  // Person + check — you approve each request.
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 19a6 6 0 0 1 9.5-4.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m14.5 17.5 2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
