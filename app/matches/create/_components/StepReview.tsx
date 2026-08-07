"use client";

import DescriptionCard from "../../[id]/_components/DescriptionCard";
import ScheduleCard from "../../[id]/_components/ScheduleCard";
import CourtCard from "../../[id]/_components/CourtCard";
import InfoBanner from "../../[id]/_components/InfoBanner";
import ReviewPlayers, { type ReviewRow } from "./ReviewPlayers";
import { toPersianDigits } from "../../../../lib/persian";
import { JALALI_MONTHS, isoToJalali } from "../../../../lib/jalali";
import type { CourtOption, CreateMatchDraft, MatchPlayer } from "../../../../lib/types";

const INVITE_NOTE: Record<NonNullable<CreateMatchDraft["invite"]>, string> = {
  public: "این مَچ به صورت عمومی برگزار می‌شود و همه می‌توانند درخواست ورود بدهند.",
  private: "این مَچ خصوصی است و بازیکنان فقط با تایید شما اضافه می‌شوند.",
};

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

  const rows: ReviewRow[] = [
    { name: "شما", role: draft.myRole === "captain" ? "برگزار کننده" : "بازیکن" },
    ...draft.teammates
      .filter((t): t is number => t !== null)
      .map((i) => players[i])
      .map((p) => ({ name: p.name, role: "یار", level: p.level, avatar: p.avatar })),
  ];

  return (
    <>
      <DescriptionCard text={draft.description.trim() || "توضیحاتی ثبت نشده است."} />
      <ReviewPlayers rows={rows} />
      {draft.invite && <InfoBanner text={INVITE_NOTE[draft.invite]} />}
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
