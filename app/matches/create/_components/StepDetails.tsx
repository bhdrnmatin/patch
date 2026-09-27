"use client";

import TextField from "./TextField";
import TextArea from "./TextArea";
import RadioCardGroup, { type RadioCardOption } from "./RadioCardGroup";
import ScoreStepper from "../../[id]/results/_components/ScoreStepper";
import { maxTeammates, type CreateMatchDraft } from "../../../../lib/types";
import { capacityLimits } from "../../../../lib/api/matches";
import type { MatchFormatResponse } from "../../../../lib/api/types";
import { toPersianDigits } from "../../../../lib/persian";

/**
 * رقابتی maps to the API's `matchType: COMPETITIVE`, which the backend refuses
 * outright: `POST /matches` returns 400 «مسابقات رقابتی هنوز فعال نشده‌اند»
 * (probed 2026-09-12). Letting it be picked means filling five steps to be
 * turned away at submit, so it is greyed out until the backend enables it.
 *
 * **To re-enable, flip this one flag.** Everything else about رقابتی — the 2v2
 * team preview, the capacity mapping — is untouched and working.
 */
const COMPETITIVE_ENABLED = false;

const FORMAT_OPTIONS: RadioCardOption[] = [
  {
    id: "competitive",
    title: "رقابتی",
    description: "برای مَچ جدی با ثبت نتیجه و تأثیر بر رنکینگ",
    icon: <TrophyIcon />,
    disabled: !COMPETITIVE_ENABLED,
    note: COMPETITIVE_ENABLED ? undefined : "به‌زودی",
  },
  {
    id: "friendly",
    title: "دوستانه",
    description: "بدون ثبت نتیجه و تأثیر بر رنکینگ",
    icon: <HandshakeIcon />,
  },
  {
    id: "americano",
    title: "آمریکانو",
    description: "چرخش بازیکنان و امتیازگیری انفرادی",
    icon: <ShuffleIcon />,
  },
];

const INVITE_OPTIONS: RadioCardOption[] = [
  {
    id: "private",
    title: "خصوصی",
    description: "فقط با لینک دعوت قابل مشاهده است.",
    icon: <LockIcon />,
  },
  {
    id: "public",
    title: "عمومی",
    description: "در فهرست مچ‌های روز دیده می‌شود",
    icon: <GlobeIcon />,
  },
];

interface Props {
  draft: CreateMatchDraft;
  patch: (p: Partial<CreateMatchDraft>) => void;
  formats: MatchFormatResponse[];
}

/** Step ۱ مشخصات: game mode + visibility radio cards, title + description. */
export default function StepDetails({ draft, patch, formats }: Props) {
  const { min, max } = capacityLimits(formats, draft.format);
  const capacity = draft.capacity ?? min;
  // Fewer seats can't hold everyone already added — step ۴ couldn't show them.
  const setCapacity = (c: number) =>
    patch({ capacity: c, teammates: draft.teammates.slice(0, maxTeammates(c)) });

  return (
    <>
      <RadioCardGroup
        label="حالت مَچ"
        subtitle="نتیجه مَچ روی رنکینگ اثر داشته باشد؟"
        options={FORMAT_OPTIONS}
        value={draft.format}
        onChange={(id) => {
          const format = id as CreateMatchDraft["format"];
          // A new format starts at its own minimum (user, 2026-09-27).
          const c = capacityLimits(formats, format).min;
          patch({ format, capacity: c, teammates: draft.teammates.slice(0, maxTeammates(c)) });
        }}
      />
      {draft.format && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-ink-soft text-right" dir="rtl">
            ظرفیت مَچ
          </span>
          <div className="w-full bg-white border border-edge rounded-card px-4 py-3 shadow-card flex items-center justify-between gap-3">
            {min === max ? (
              <span className="text-xl font-bold text-ink">{toPersianDigits(String(min))}</span>
            ) : (
              <ScoreStepper label="ظرفیت مَچ" value={capacity} min={min} max={max} onChange={setCapacity} />
            )}
            <span className="text-xs text-muted text-right leading-5" dir="rtl">
              {min === max
                ? `این نوع مَچ همیشه ${toPersianDigits(String(min))} نفره است`
                : `از ${toPersianDigits(String(min))} تا ${toPersianDigits(String(max))} نفر، با خودتان`}
            </span>
          </div>
        </div>
      )}
      <RadioCardGroup
        label="نمایش مَچ"
        subtitle="چه کسانی بتوانند مَچ را ببینند؟"
        options={INVITE_OPTIONS}
        value={draft.invite}
        onChange={(id) => patch({ invite: id as CreateMatchDraft["invite"] })}
      />
      <TextField
        label="عنوان مَچ (اختیاری)"
        value={draft.title}
        onChange={(title) => patch({ title })}
        placeholder="مثلا پدل عصر پنجشنبه"
      />
      <TextArea
        label="توضیحات (اختیاری)"
        value={draft.description}
        onChange={(description) => patch({ description })}
        placeholder="توضیحاتی برای بازیکنان بنویسید..."
      />
    </>
  );
}

function TrophyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5H5a2 2 0 0 0 0 4h1M17 5h2a2 2 0 0 1 0 4h-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HandshakeIcon() {
  // Two people — reads as friendly / social.
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 5.5a3 3 0 0 1 0 5M17 19a5.5 5.5 0 0 0-2.8-4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ShuffleIcon() {
  // Rotation / cycle — reads as rotating partners (americano).
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 11a8 8 0 0 0-13.7-5.3L4 8M4 3.5V8h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 13a8 8 0 0 0 13.7 5.3L20 16M20 20.5V16h-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
