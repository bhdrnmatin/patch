"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { appScrollEl } from "@/app/_components/AppScroll";
import WizardHeader from "./_components/WizardHeader";
import StepChips from "./_components/StepChips";
import WizardFooter from "./_components/WizardFooter";
import StepDetails from "./_components/StepDetails";
import StepLocation from "./_components/StepLocation";
import StepSchedule from "./_components/StepSchedule";
import StepPlayers from "./_components/StepPlayers";
import StepReview from "./_components/StepReview";
import { getCourtOptions, getPickablePlayers, createMatch } from "@/lib/data";
import type { CreateMatchDraft } from "../../../lib/types";

const STEP_LABELS = ["مشخصات", "مکان", "زمان‌بندی", "بازیکنان", "اتمام"];
const STEP_SUBTITLES = [
  "مشخصات مَچ",
  "انتخاب مکان",
  "زمان‌بندی مَچ",
  "انتخاب بازیکنان",
  "بازبینی و ثبت",
];

const emptyDraft: CreateMatchDraft = {
  format: null,
  title: "",
  description: "",
  reserved: null,
  courtId: null,
  date: null,
  time: null,
  duration: null,
  myRole: null,
  teammates: [],
  coach: null,
  invite: null,
};

const isStepValid: ((d: CreateMatchDraft) => boolean)[] = [
  (d) => d.format !== null && d.invite !== null, // title (عنوان مَچ) is optional
  (d) => d.reserved === true && d.courtId !== null, // must have reserved a court + picked it
  (d) => d.date !== null && d.time !== null && d.duration !== null,
  (d) => d.myRole !== null,
  () => true,
];

function CreateMatchContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: courts } = useSuspenseQuery({ queryKey: ["courtOptions"], queryFn: getCourtOptions });
  const { data: players } = useSuspenseQuery({
    queryKey: ["pickablePlayers"],
    queryFn: getPickablePlayers,
  });

  const [step, setStep] = useState(0);
  // Furthest step reached — every step up to it stays tappable (jump back AND forward).
  const [maxStep, setMaxStep] = useState(0);
  const [draft, setDraft] = useState<CreateMatchDraft>(emptyDraft);
  const patch = (p: Partial<CreateMatchDraft>) => setDraft((d) => ({ ...d, ...p }));

  const goTo = (target: number) => {
    setStep(target);
    setMaxStep((m) => Math.max(m, target));
    appScrollEl()?.scrollTo({ top: 0 });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createMatch,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      router.push(`/matches/${id}?role=creator&status=upcoming`);
    },
  });

  const isLast = step === STEP_LABELS.length - 1;

  return (
    <main className="relative mx-auto w-full max-w-[430px] min-h-dvh bg-surface">
      <div className="h-11" aria-hidden />
      <WizardHeader
        subtitle={STEP_SUBTITLES[step]}
        step={step + 1}
        total={STEP_LABELS.length}
        onClose={() => router.push("/matches")}
      />
      <div className="mt-4">
        <StepChips labels={STEP_LABELS} current={step} maxStep={maxStep} onJump={goTo} />
      </div>

      <div className="px-6 pt-4 flex flex-col gap-4">
        {step === 0 && <StepDetails draft={draft} patch={patch} />}
        {step === 1 && <StepLocation draft={draft} patch={patch} courts={courts} />}
        {step === 2 && <StepSchedule draft={draft} patch={patch} />}
        {step === 3 && <StepPlayers draft={draft} patch={patch} players={players} />}
        {step === 4 && <StepReview draft={draft} courts={courts} players={players} />}
        {/* clearance for the fixed footer */}
        <div className="h-[calc(6rem+var(--safe-b))]" aria-hidden />
      </div>

      {/* Remounted when the back button appears or goes, so the bar is a new
          DOM node rather than a relaid-out one. Safari kept the step-0
          full-width بعدی painted underneath the halved row otherwise — visible
          as a blue sliver in the 12px gap, old centred glyph and all.
          `.fixed-bar`'s translateZ only promotes the layer; it doesn't force
          its contents to repaint. */}
      <WizardFooter
        key={step > 0 ? "with-back" : "no-back"}
        nextLabel={isLast ? "تایید و ثبت" : "بعدی"}
        backLabel={isLast ? "بازگشت" : "قبلی"}
        onNext={() => (isLast ? mutate(draft) : goTo(step + 1))}
        nextDisabled={!isStepValid[step](draft)}
        pending={isPending}
        onBack={step > 0 ? () => goTo(step - 1) : undefined}
      />
    </main>
  );
}

export default function CreateMatchPage() {
  return (
    <Suspense>
      <CreateMatchContent />
    </Suspense>
  );
}
