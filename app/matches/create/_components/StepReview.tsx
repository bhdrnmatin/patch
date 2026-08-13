"use client";

import DescriptionCard from "../../[id]/_components/DescriptionCard";
import ScheduleCard from "../../[id]/_components/ScheduleCard";
import CourtCard from "../../[id]/_components/CourtCard";
import InfoBanner from "../../[id]/_components/InfoBanner";
import ReviewPlayers, { type ReviewRow } from "./ReviewPlayers";
import { toPersianDigits } from "../../../../lib/persian";
import { JALALI_MONTHS, isoToJalali } from "../../../../lib/jalali";
import type { CourtOption, CreateMatchDraft, MatchPlayer } from "../../../../lib/types";

const JOIN_NOTE: Record<NonNullable<CreateMatchDraft["joinMethod"]>, string> = {
  open: "هر بازیکنی بدون تایید شما وارد می‌شود.",
  invite: "ورود فقط با لینک دعوت امکان‌پذیر است.",
  approval: "درخواست‌های ورود را شما قبول یا رد می‌کنید.",
};

/** Visibility + how players get in. A private match is link-only, so its join
 *  method is already implied by the visibility sentence — no second one. */
function inviteNote(draft: CreateMatchDraft): string | null {
  if (draft.invite === "private") return "این مَچ خصوصی است و فقط با لینک دعوت دیده می‌شود.";
  if (draft.invite !== "public") return null;
  const join = draft.joinMethod ? ` ${JOIN_NOTE[draft.joinMethod]}` : "";
  return `این مَچ در فهرست مَچ‌ها دیده می‌شود.${join}`;
}

/** "۱۴ مرداد ۱۴۰۵" from an ISO gregorian date. */
function jalaliLabel(iso: string): string {
  const { jy, jm, jd } = isoToJalali(iso);
  return `${toPersianDigits(String(jd))} ${JALALI_MONTHS[jm - 1]} ${toPersianDigits(String(jy))}`;
}
/** Add minutes to "HH:MM", wrapping at 24h. */
function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

interface Props {
  draft: CreateMatchDraft;
  courts: CourtOption[];
  players: MatchPlayer[];
}

/** Step ۶ اتمام: read-only summary composed from existing match-details cards. */
export default function StepReview({ draft, courts, players }: Props) {
  const court = courts.find((c) => c.id === draft.courtId);
  const note = inviteNote(draft);

  const rows: ReviewRow[] = [
    { name: "شما", role: draft.myRole === "captain" ? "برگزار کننده" : "بازیکن" },
    ...draft.teammates.flatMap((t, i): ReviewRow[] => {
      const isCoach = draft.coach === i;
      // Invited numbers haven't accepted yet, so they carry no level or avatar.
      if (t.kind === "invite") {
        return [{ name: t.name, role: isCoach ? "برگزار کننده" : "دعوت‌شده" }];
      }
      const p = players[t.index];
      return p
        ? [{ name: p.name, role: isCoach ? "برگزار کننده" : "یار", level: p.level, avatar: p.avatar }]
        : [];
    }),
  ];

  return (
    <>
      <DescriptionCard text={draft.description.trim() || "توضیحاتی ثبت نشده است."} />
      <ReviewPlayers rows={rows} />
      {note && <InfoBanner text={note} />}
      <ScheduleCard
        date={draft.date ? jalaliLabel(draft.date) : ""}
        timeRange={
          draft.time
            ? `${toPersianDigits(draft.time)}${
                draft.duration ? ` تا ${toPersianDigits(addMinutes(draft.time, draft.duration))}` : ""
              }`
            : ""
        }
      />
      <CourtCard club={court?.club ?? ""} note={court?.location ?? ""} />
    </>
  );
}
