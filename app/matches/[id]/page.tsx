"use client";

import { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
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
import { getMatchDetails, viewerRole } from "@/lib/data";
import { getAccountId } from "@/lib/api/session";
import { cancelMatch, joinMatch, leaveMatch } from "@/lib/api/matches";
import type { MatchDetailsStatus, ViewerParticipation, ViewerRole } from "../../../lib/types";

const STAGE = {
  upcoming: { title: "در انتظار شروع بازی", nextLabel: "بازی شروع شده است", stage: 1 },
  live: { title: "بازی شروع شده است", nextLabel: "وارد کردن نتیجه", stage: 2 },
  finished: { title: "بازی تمام شده است", nextLabel: "نهایی کردن نتیجه", stage: 3 },
} as const;

/** What the CTA does when tapped. `results` navigates; the rest are mutations. */
type CtaAction = "cancel-match" | "join" | "leave" | "results";

/**
 * The bottom CTA, from role × stage × **where the viewer stands**.
 *
 * That third input is the point. The old matrix used role and stage only, so a
 * stranger opening a public match was offered «لغو ارسال درخواست ورود» — cancel
 * a request they had never made — and a confirmed player got the same button
 * instead of «ترک مَچ».
 *
 * Returns null when there is nothing to offer, and the page renders no bar at
 * all rather than a button that does nothing.
 */
function ctaFor(
  role: ViewerRole,
  stage: MatchDetailsStatus,
  part: ViewerParticipation,
  needsApproval: boolean,
): { label: string; caption?: string; action: CtaAction } | null {
  if (role === "creator") {
    if (stage === "upcoming") return { label: "لغو مَچ", action: "cancel-match" };
    return {
      label: stage === "live" ? "وارد کردن نتیجه" : "نهایی کردن نتیجه",
      action: "results",
    };
  }

  if (stage === "finished") {
    return part === "none"
      ? null
      : { label: "مشاهده نتیجه", caption: "شما می‌توانید به نتیجه اعتراض کنید", action: "results" };
  }

  if (part === "confirmed")
    return { label: "ترک مَچ", caption: "شما عضوی از بازی هستید", action: "leave" };
  if (part === "requested")
    return {
      label: "لغو ارسال درخواست ورود",
      caption: "در انتظار تایید درخواست سازنده بازی",
      action: "leave",
    };
  // Not involved. Joining a match already under way is not offered.
  // Only a MANUAL_APPROVE match makes this a request; everywhere else the API
  // confirms immediately, and «درخواست ورود» promised a wait that never came.
  if (stage !== "upcoming") return null;
  return needsApproval
    ? { label: "درخواست ورود", caption: "پس از تایید سازنده عضو مَچ می‌شوید", action: "join" }
    : { label: "پیوستن به مَچ", action: "join" };
}

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
  const derivedRole = viewerRole(m.organizerAccountId, getAccountId());
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
  const cta = ctaFor(role, status, m.viewerParticipation, m.needsApproval);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: runCta, isPending: ctaPending } = useMutation({
    mutationFn: async (action: CtaAction) => {
      if (action === "join") return void (await joinMatch(id));
      if (action === "leave") return void (await leaveMatch(id));
      if (action === "cancel-match") return void (await cancelMatch(id));
    },
    onSuccess: (_data, action) => {
      // Refetch rather than patch: joining can land as CONFIRMED or REQUESTED
      // depending on the match's joinPolicy, and only the server knows which.
      queryClient.invalidateQueries({ queryKey: ["matchDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      // Joining closes any invitation to this match, so /activity's card for it
      // is stale — and answering a card the server has closed is a 409.
      queryClient.invalidateQueries({ queryKey: ["activitySections"] });
      if (action === "cancel-match") router.push("/matches");
    },
  });

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
    <main className="hero-page relative mx-auto w-full max-w-[430px] bg-surface pb-36">
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

      {cta && (
        <MatchCtaBar
          label={cta.label}
          caption={cta.caption}
          busy={ctaPending}
          onClick={() =>
            cta.action === "results"
              ? router.push(`/matches/${id}/results`)
              : runCta(cta.action)
          }
        />
      )}
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
