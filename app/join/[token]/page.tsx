"use client";

import { Suspense, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getClubs } from "@/lib/api/clubs";
import { getMatchDetails } from "@/lib/data";
import { ApiError } from "@/lib/api/client";
import {
  getMatchByInviteToken,
  joinByInviteToken,
  tehranDateISO,
  tehranTimeRange,
} from "@/lib/api/matches";
import { getAccountId } from "@/lib/api/session";
import { jalaliDayMonth } from "@/lib/jalali";
import { toPersianDigits } from "@/lib/persian";
import MatchCtaBar from "../../matches/[id]/_components/MatchCtaBar";
import InfoItem from "../../matches/[id]/_components/InfoItem";
import { CalendarIcon } from "@/app/(main)/_components/icons";
import { CourtIcon, WhistleIcon } from "@/app/(main)/_components/BottomNav";

/**
 * What a share link opens: the match it points at, and one button to join it.
 *
 * The preview deliberately shows less than the match page — the API's own
 * response carries no participants for a token, so there is no roster to draw
 * and nothing here leaks who is playing to whoever was forwarded the link.
 */
function JoinContent() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: match, error } = useQuery({
    queryKey: ["inviteMatch", token],
    queryFn: () => getMatchByInviteToken(token),
    retry: false,
  });
  const { data: clubs } = useQuery({ queryKey: ["clubs"], queryFn: getClubs });

  // A link is opened more than once — forwarded, bookmarked, tapped again after
  // joining. The token's own response says nothing about who is in the match
  // (participants always come back empty), so ask the match itself: anyone
  // already in it, the organizer included, is sent straight there rather than
  // being offered an invitation to something they are part of.
  //
  // **The failure is the answer here.** `GET /matches/{id}` is 404 «مچ یافت نشد»
  // for someone outside a private match — which is exactly who a share link is
  // for — so this must not propagate. It did, and the first tap on a private
  // link hit the app's error screen. A caught error means "not in it".
  // **Its own key, not ["matchDetails", id].** That is the match page's key, and
  // its `queryFn` never returns null — seeding a null into it under a shared key
  // crashed that page on `organizerAccountId` the moment this redirected there.
  const { data: details, isPending: checkingMembership } = useQuery({
    queryKey: ["inviteMembership", match?.id],
    queryFn: () => getMatchDetails(match!.id).catch(() => null),
    enabled: !!match?.id,
    retry: false,
  });
  const alreadyIn =
    !!details && (details.viewerParticipation === "confirmed" || details.organizerAccountId === getAccountId());

  useEffect(() => {
    if (alreadyIn && match) router.replace(`/matches/${match.id}`);
  }, [alreadyIn, match, router]);

  const openMatch = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["matches"] });
    queryClient.invalidateQueries({ queryKey: ["activitySections"] });
    // The page we are about to show holds this from before the join.
    queryClient.invalidateQueries({ queryKey: ["matchDetails", id] });
    router.replace(`/matches/${id}`);
  };

  const { mutate: join, isPending, error: joinError } = useMutation({
    mutationFn: () => joinByInviteToken(token),
    onSuccess: () => match && openMatch(match.id),
    // Already in: the link did its job earlier, so show them the match rather
    // than an error about a state they wanted to be in anyway.
    onError: (e) => {
      if (e instanceof ApiError && e.status === 409 && match) openMatch(match.id);
    },
  });

  if (error) {
    return (
      <Message
        title="این لینک معتبر نیست"
        text="ممکن است مَچ لغو شده باشد یا لینک عوض شده باشد. از فرستنده لینک تازه بگیرید."
        onBack={() => router.replace("/matches")}
      />
    );
  }

  // Holding the invitation back until membership is known is what keeps a
  // member from seeing "you are invited" for a second on the way to the match.
  if (!match || checkingMembership || alreadyIn) return <Spinner />;

  // A cancelled or finished match still answers `GET /matches/invite/{token}`
  // with 200 and its token intact (probed 2026-09-22) — deleting a match only
  // soft-cancels it. Without this the page drew the whole invitation and a
  // «پیوستن به مَچ» button for a match nobody can join. Only OPEN is joinable:
  // FINISHED and both cancelled kinds are dead ends. It sits *after* the
  // membership check so someone already in the match still lands on it.
  if (match.status !== "OPEN") {
    const finished = match.status === "FINISHED";
    return (
      <Message
        title={finished ? "این مَچ برگزار شده است" : "این مَچ لغو شده است"}
        text={
          finished
            ? "این مَچ تمام شده و دیگر نمی‌توانید به آن بپیوندید."
            : "برگزارکننده این مَچ را لغو کرده است. برای مَچ تازه با او در تماس باشید."
        }
        onBack={() => router.replace("/matches")}
      />
    );
  }

  const club = clubs?.content.find((c) => c.id === match.clubId);
  const organizer = `${match.organizer.firstName ?? ""} ${match.organizer.lastName ?? ""}`
    .replace(/\s+/g, " ")
    .trim();

  return (
    <main className="relative mx-auto w-full max-w-[430px] min-h-dvh bg-surface pb-36">
      <div className="h-11" aria-hidden />
      <header className="px-6 pt-6 flex flex-col items-end gap-1 text-right">
        <p className="text-sm text-muted" dir="rtl">
          {organizer ? `${organizer} شما را دعوت کرده است` : "شما به این مَچ دعوت شده‌اید"}
        </p>
        <h1 className="text-title font-bold text-ink" dir="rtl">
          {match.title ?? jalaliDayMonth(tehranDateISO(match.scheduledAt))}
        </h1>
      </header>

      <section className="mx-6 mt-6 grid grid-cols-2 gap-4 rounded-group bg-white p-4 shadow-card" dir="rtl">
        <InfoItem icon={<CalendarIcon className="size-5" />} label="تاریخ">
          {jalaliDayMonth(tehranDateISO(match.scheduledAt))}
        </InfoItem>
        <InfoItem icon={<ClockIcon />} label="ساعت">
          {tehranTimeRange(match.scheduledAt, match.durationHours)}
        </InfoItem>
        <InfoItem icon={<CourtIcon className="size-5" />} label="باشگاه">
          {club?.name ?? "—"}
        </InfoItem>
        <InfoItem icon={<WhistleIcon className="size-5" />} label="ظرفیت">
          {toPersianDigits(String(match.capacity))} نفر
        </InfoItem>
      </section>

      {joinError && !(joinError instanceof ApiError && joinError.status === 409) && (
        <p role="alert" className="px-6 pt-4 text-sm text-danger-deep text-right leading-6" dir="rtl">
          {joinError.message || "ورود به مَچ انجام نشد. دوباره تلاش کنید."}
        </p>
      )}

      <MatchCtaBar label="پیوستن به مَچ" busy={isPending} onClick={() => join()} />
    </main>
  );
}

function Spinner() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-surface" role="status" aria-label="در حال بارگذاری">
      <span className="size-6 rounded-full border-2 border-edge border-t-primary animate-spin" />
    </div>
  );
}

function Message({ title, text, onBack }: { title: string; text: string; onBack: () => void }) {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-3 bg-surface px-10 text-center" dir="rtl">
      <h1 className="text-base font-bold text-ink">{title}</h1>
      <p className="text-sm text-muted leading-6">{text}</p>
      <button type="button" onClick={onBack} className="mt-2 text-sm font-bold text-primary">
        رفتن به مَچ‌ها
      </button>
    </main>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function JoinByTokenPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <JoinContent />
    </Suspense>
  );
}
