"use client";

import { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
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
import { getMatchDetails } from "@/lib/data";
import { getAccountId } from "@/lib/api/session";
import type { MatchDetailsStatus, ViewerRole } from "../../../lib/types";

const STAGE = {
  upcoming: { title: "در انتظار شروع بازی", nextLabel: "بازی شروع شده است", stage: 1 },
  live: { title: "بازی شروع شده است", nextLabel: "وارد کردن نتیجه", stage: 2 },
  finished: { title: "بازی تمام شده است", nextLabel: "نهایی کردن نتیجه", stage: 3 },
} as const;

const CTA: Record<ViewerRole, Record<MatchDetailsStatus, { label: string; caption?: string }>> = {
  creator: {
    upcoming: { label: "لغو مَچ" },
    live: { label: "وارد کردن نتیجه" },
    finished: { label: "نهایی کردن نتیجه" },
  },
  player: {
    upcoming: { label: "لغو ارسال درخواست ورود", caption: "در انتظار تایید درخواست سازنده بازی" },
    live: { label: "ترک مَچ", caption: "شما عضوی از بازی هستید" },
    finished: { label: "مشاهده نتیجه", caption: "شما می‌توانید به نتیجه اعتراض کنید" },
  },
};

function MatchDetailsContent() {
  const params = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const { data: m } = useSuspenseQuery({
    queryKey: ["matchDetails", id],
    queryFn: () => getMatchDetails(id),
  });

  // Both of these used to come from `?role=` and `?status=`, which was a device
  // for building the six Figma frames — and it shipped, so every visitor got the
  // creator view of every match, «لغو مَچ» included. They are real data now: the
  // organizer's account id against the token's `sub`, and the stage off the
  // clock. The query params still override, but only outside production, so the
  // frames stay reachable for design review without being a live footgun.
  const derivedRole: ViewerRole = m.organizerAccountId === getAccountId() ? "creator" : "player";
  const roleParam = params.get("role");
  const statusParam = params.get("status");
  const overridable = process.env.NODE_ENV !== "production";

  const role: ViewerRole =
    overridable && (roleParam === "player" || roleParam === "creator") ? roleParam : derivedRole;
  const status: MatchDetailsStatus =
    overridable && (statusParam === "live" || statusParam === "finished" || statusParam === "upcoming")
      ? statusParam
      : m.stage;
  const stage = STAGE[status];
  const cta = CTA[role][status];
  const router = useRouter();
  const ctaGoesToResults = role === "creator" && status === "live";

  // Players grid placement varies by frame: player/live+finished show it right under
  // the stage card; creator/live hides it; everything else shows it after توضیحات.
  const playersPlacement: "top" | "middle" | "hidden" =
    role === "player" && status !== "upcoming"
      ? "top"
      : role === "creator" && status === "live"
        ? "hidden"
        : "middle";

  // Approving people is the most time-sensitive thing a creator does, so the
  // requests sit in the same top slot the players grid uses — which creator/live
  // leaves empty. They were last on the page, below the FAQ, which meant
  // scrolling past everything to answer someone waiting to get in.
  const joinRequests = role === "creator" && m.requests.length > 0 ? m.requests : null;

  return (
    <main className="relative mx-auto w-full max-w-[430px] min-h-dvh bg-surface pb-36">
      <MatchDetailsHeader title={m.title} showEdit={role === "creator"} />

      <div className="px-6 pt-4 flex flex-col gap-4">
        <MatchStageCard {...stage} totalStages={3} />

        {joinRequests && <JoinRequestsSection requests={joinRequests} matchId={id} />}

        {playersPlacement === "top" && <PlayersSection players={m.players} />}

        <MatchInfoCard match={m} />
        <ScheduleCard date={m.date} deadline={m.deadline} timeRange={m.timeRange} />
        <DescriptionCard text={m.description} />

        {playersPlacement === "middle" && <PlayersSection players={m.players} />}
        {m.teamNote && <InfoBanner text={m.teamNote} />}

        <PromoCard />
        <CourtCard club={m.club} note={m.courtNote} lat={m.courtLat} lng={m.courtLng} />
        <ShareCard restriction={m.restriction} matchId={id} />
        {m.faq.length > 0 && <FaqSection faq={m.faq} />}
      </div>

      <MatchCtaBar
        label={cta.label}
        caption={cta.caption}
        onClick={ctaGoesToResults ? () => router.push(`/matches/${id}/results`) : undefined}
      />
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
