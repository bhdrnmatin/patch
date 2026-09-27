import SectionCard from "./SectionCard";
import InfoItem from "./InfoItem";
import { MoneyIcon } from "./icons";
import { TomanIcon } from "../../../(main)/_components/icons";
import { WhistleIcon, CourtIcon, MatchesIcon } from "../../../(main)/_components/BottomNav";
import { toPersianDigits } from "../../../../lib/persian";
import type { MatchDetails } from "../../../../lib/types";

interface Props {
  match: MatchDetails;
}

/**
 * اطلاعات card: 2-column grid of labeled values, filling from the right.
 * The date and the headcount aren't repeated here — the schedule card and the
 * court above already say them, bigger. A lone last tile spans both columns.
 */
export default function MatchInfoCard({ match }: Props) {
  return (
    <SectionCard title="اطلاعات">
      <div className="grid grid-cols-2 gap-2 [&>*:last-child:nth-child(odd)]:col-span-2" dir="rtl">
        {/* Pricing ships after the MVP; an entry fee of ۰ would read as free
            rather than unknown, so the tile is dropped instead. */}
        {match.fee !== undefined && (
          <InfoItem icon={<MoneyIcon />} label="هزینه ورودی">
            <span className="flex items-center gap-1">
              {toPersianDigits(match.fee.toLocaleString("en-US"))}
              <TomanIcon className="size-4" />
            </span>
          </InfoItem>
        )}
        <InfoItem icon={<WhistleIcon className="size-5" />} label="فرمت مچ">
          {match.format}
        </InfoItem>
        <InfoItem icon={<CourtIcon className="size-5" />} label="باشگاه">
          {match.club}
        </InfoItem>
        <InfoItem icon={<MatchesIcon className="size-5" />} label="سازنده مَچ">
          {match.creator}
        </InfoItem>
      </div>
    </SectionCard>
  );
}
