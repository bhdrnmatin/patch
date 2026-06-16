import SectionCard from "./SectionCard";
import InfoItem from "./InfoItem";
import { MoneyIcon, TwoUsersIcon } from "./icons";
import { CalendarIcon, TomanIcon } from "../../../(main)/_components/icons";
import { WhistleIcon, CourtIcon, MatchesIcon } from "../../../(main)/_components/BottomNav";
import { toPersianDigits } from "../../../../lib/persian";
import type { MatchDetails } from "../../../../lib/types";

interface Props {
  match: MatchDetails;
}

/** اطلاعات card: 2-column grid of labeled values. */
export default function MatchInfoCard({ match }: Props) {
  const participants = `${toPersianDigits(String(match.filled))}/${toPersianDigits(String(match.capacity))} نفر`;

  return (
    <SectionCard title="اطلاعات">
      <div className="grid grid-cols-2 gap-3">
        <InfoItem icon={<MoneyIcon />} label="هزینه ورودی">
          <span className="flex items-center gap-1">
            {toPersianDigits(match.fee.toLocaleString("en-US"))}
            <TomanIcon className="size-4" />
          </span>
        </InfoItem>
        <InfoItem icon={<WhistleIcon className="size-5" />} label="فرمت مچ">
          {match.format}
        </InfoItem>
        <InfoItem icon={<CourtIcon className="size-5" />} label="باشگاه">
          {match.club}
        </InfoItem>
        <InfoItem icon={<TwoUsersIcon />} label="شرکت کنندگان">
          {participants}
        </InfoItem>
        <InfoItem icon={<MatchesIcon className="size-5" />} label="سازنده بازی">
          {match.creator}
        </InfoItem>
        <InfoItem icon={<CalendarIcon className="size-5" />} label="تاریخ">
          {match.date}
        </InfoItem>
      </div>
    </SectionCard>
  );
}
