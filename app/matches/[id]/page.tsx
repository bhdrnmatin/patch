"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import MatchDetailsHeader from "./_components/MatchDetailsHeader";
import MatchStageCard from "./_components/MatchStageCard";
import MatchInfoCard from "./_components/MatchInfoCard";
import ScheduleCard from "./_components/ScheduleCard";
import DescriptionCard from "./_components/DescriptionCard";
import PlayersSection from "./_components/PlayersSection";
import InfoBanner from "./_components/InfoBanner";
import PromoCard from "./_components/PromoCard";
import CourtCard from "./_components/CourtCard";
import ShareCard from "./_components/ShareCard";
import FaqSection from "./_components/FaqSection";
import JoinRequestsSection from "./_components/JoinRequestsSection";
import MatchCtaBar from "./_components/MatchCtaBar";
import ResultSheet from "./_components/ResultSheet";
import { matchDetails } from "../../../lib/mock";
import type { MatchDetailsStatus, ViewerRole } from "../../../lib/types";

const STAGE = {
  upcoming: { title: "در انتظار شروع بازی", nextLabel: "بازی شروع شده است", stage: 1 },
  live: { title: "بازی شروع شده است", nextLabel: "وارد کردن نتیجه", stage: 2 },
  finished: { title: "بازی تمام شده است", nextLabel: "نهایی کردن نتیجه", stage: 3 },
} as const;

const CTA: Record<ViewerRole, Record<MatchDetailsStatus, { label: string; caption?: string }>> = {
  creator: {
    upcoming: { label: "لغو مسابقه" },
    live: { label: "وارد کردن نتیجه" },
    finished: { label: "نهایی کردن نتیجه" },
  },
  player: {
    upcoming: { label: "لغو ارسال درخواست ورود", caption: "در انتظار تایید درخواست سازنده بازی" },
    live: { label: "ترک مسابقه", caption: "شما عضوی از بازی هستید" },
    finished: { label: "مشاهده نتیجه", caption: "شما می‌توانید به نتیجه اعتراض کنید" },
  },
};

function MatchDetailsContent() {
  const params = useSearchParams();
  const role: ViewerRole = params.get("role") === "player" ? "player" : "creator";
  const statusParam = params.get("status");
  const status: MatchDetailsStatus =
    statusParam === "live" || statusParam === "finished" ? statusParam : "upcoming";

  const m = matchDetails;
  const stage = STAGE[status];
  const cta = CTA[role][status];
  const [resultOpen, setResultOpen] = useState(false);
  const ctaOpensResultSheet = role === "creator" && status === "live";

  // Players grid placement varies by frame: player/live+finished show it right under
  // the stage card; creator/live hides it; everything else shows it after توضیحات.
  const playersPlacement: "top" | "middle" | "hidden" =
    role === "player" && status !== "upcoming"
      ? "top"
      : role === "creator" && status === "live"
        ? "hidden"
        : "middle";

  return (
    <main className="relative mx-auto w-full max-w-[430px] min-h-dvh bg-surface pb-36">
      <MatchDetailsHeader title={m.title} showEdit={role === "creator"} />

      <div className="px-6 pt-4 flex flex-col gap-4">
        <MatchStageCard {...stage} totalStages={3} />

        {playersPlacement === "top" && <PlayersSection players={m.players} />}

        <MatchInfoCard match={m} />
        <ScheduleCard date={m.date} deadline={m.deadline} timeRange={m.timeRange} />
        <DescriptionCard text={m.description} />

        {playersPlacement === "middle" && <PlayersSection players={m.players} />}
        <InfoBanner text={m.teamNote} />

        <PromoCard />
        <CourtCard club={m.club} note={m.courtNote} />
        <ShareCard restriction={m.restriction} />
        <FaqSection faq={m.faq} />

        {role === "creator" && <JoinRequestsSection requests={m.requests} />}
      </div>

      <MatchCtaBar
        label={cta.label}
        caption={cta.caption}
        onClick={ctaOpensResultSheet ? () => setResultOpen(true) : undefined}
      />
      <ResultSheet open={resultOpen} onClose={() => setResultOpen(false)} />
    </main>
  );
}

export default function MatchDetailsPage() {
  return (
    <Suspense>
      <MatchDetailsContent />
    </Suspense>
  );
}
