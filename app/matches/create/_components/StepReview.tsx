"use client";

import DescriptionCard from "../../[id]/_components/DescriptionCard";
import ScheduleCard from "../../[id]/_components/ScheduleCard";
import CourtCard from "../../[id]/_components/CourtCard";
import InfoBanner from "../../[id]/_components/InfoBanner";
import ReviewPlayers, { type ReviewRow } from "./ReviewPlayers";
import { toPersianDigits } from "../../../../lib/persian";
import type {
  CourtOption,
  CreateMatchDraft,
  DayOption,
  Daypart,
  MatchPlayer,
  MonthOption,
} from "../../../../lib/types";

const DAYPART_RANGE: Record<Daypart, string> = {
  morning: "۶:۰۰ الی ۱۲:۰۰",
  noon: "۱۲:۰۰ الی ۱۸:۰۰",
  evening: "۱۸:۰۰ الی ۲۴:۰۰",
  night: "۲۴:۰۰ الی ۶:۰۰",
};

const INVITE_NOTE: Record<NonNullable<CreateMatchDraft["invite"]>, string> = {
  public: "این مسابقه به صورت عمومی برگزار می‌شود و همه می‌توانند درخواست ورود بدهند.",
  private: "این مسابقه خصوصی است و بازیکنان فقط با تایید شما اضافه می‌شوند.",
  "invite-only": "ورود به این مسابقه فقط با دعوت‌نامه ممکن است.",
};

interface Props {
  draft: CreateMatchDraft;
  courts: CourtOption[];
  months: MonthOption[];
  days: DayOption[];
  players: MatchPlayer[];
}

/** Step ۶ اتمام: read-only summary composed from existing match-details cards. */
export default function StepReview({ draft, courts, months, days, players }: Props) {
  const day = days.find((d) => d.id === draft.dayId);
  const monthLabel = months.find((m) => m.id === draft.monthId)?.label ?? "";
  const court = courts.find((c) => c.id === draft.courtId);

  const rows: ReviewRow[] = [
    { name: "شما", role: draft.myRole === "captain" ? "کاپیتان" : "یار" },
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
        date={day ? `${toPersianDigits(String(day.day))} ${monthLabel}` : monthLabel}
        timeRange={draft.daypart ? DAYPART_RANGE[draft.daypart] : ""}
      />
      <CourtCard
        club={draft.customCourt ? "زمین شخصی" : (court?.club ?? "")}
        note={
          draft.customCourt
            ? `آدرس: ${draft.address}`
            : `${court?.name ?? ""} — پس از ثبت مسابقه رزرو می‌شود.`
        }
      />
    </>
  );
}
