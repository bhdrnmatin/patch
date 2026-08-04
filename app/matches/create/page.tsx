"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import WizardHeader from "./_components/WizardHeader";
import StepChips from "./_components/StepChips";
import WizardFooter from "./_components/WizardFooter";
import StepDetails from "./_components/StepDetails";
import StepLocation from "./_components/StepLocation";
import StepSchedule from "./_components/StepSchedule";
import StepPlayers from "./_components/StepPlayers";
import StepSettings from "./_components/StepSettings";
import StepReview from "./_components/StepReview";
import {
  getCourtOptions,
  getCourtAvailability,
  getWizardMonths,
  getPickablePlayers,
  getMatchDays,
  createMatch,
} from "@/lib/data";
import type { CreateMatchDraft, ToggleSetting } from "../../../lib/types";

const STEP_LABELS = ["مشخصات", "مکان", "زمان‌بندی", "بازیکنان", "تنظیمات", "اتمام"];
const STEP_SUBTITLES = [
  "مشخصات مَچ",
  "انتخاب مکان",
  "زمان‌بندی مَچ",
  "انتخاب بازیکنان",
  "تنظیمات مَچ",
  "بازبینی و ثبت",
];

const emptyToggle = <T,>(): ToggleSetting<T> => ({ enabled: null, value: null });

const emptyDraft: CreateMatchDraft = {
  format: null,
  title: "",
  description: "",
  reserved: null,
  courtId: null,
  monthId: "bahman",
  dayId: null,
  daypart: null,
  myRole: null,
  teammates: [null, null, null],
  invite: null,
  minLevel: emptyToggle(),
  maxLevel: emptyToggle(),
  gender: emptyToggle(),
  entryFee: emptyToggle(),
  autoApprove: null,
};

const answered = (t: ToggleSetting<unknown>) =>
  t.enabled !== null && (!t.enabled || t.value !== null);

const isStepValid: ((d: CreateMatchDraft) => boolean)[] = [
  (d) => d.format !== null && d.invite !== null, // title (عنوان مَچ) is optional
  (d) => d.reserved === true && d.courtId !== null, // must have reserved a court + picked it
  (d) => d.dayId !== null && d.daypart !== null,
  (d) => d.myRole !== null,
  (d) =>
    d.autoApprove !== null &&
    [d.minLevel, d.maxLevel, d.gender, d.entryFee].every(answered),
  () => true,
];

function CreateMatchContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: courts } = useSuspenseQuery({ queryKey: ["courtOptions"], queryFn: getCourtOptions });
  const { data: availability } = useSuspenseQuery({
    queryKey: ["courtAvailability"],
    queryFn: getCourtAvailability,
  });
  const { data: months } = useSuspenseQuery({ queryKey: ["wizardMonths"], queryFn: getWizardMonths });
  const { data: players } = useSuspenseQuery({
    queryKey: ["pickablePlayers"],
    queryFn: getPickablePlayers,
  });
  const { data: days } = useSuspenseQuery({ queryKey: ["matchDays"], queryFn: getMatchDays });

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<CreateMatchDraft>(emptyDraft);
  const patch = (p: Partial<CreateMatchDraft>) => setDraft((d) => ({ ...d, ...p }));

  const goTo = (target: number) => {
    setStep(target);
    window.scrollTo({ top: 0 });
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
        <StepChips labels={STEP_LABELS} current={step} onJump={goTo} />
      </div>

      <div className="px-6 pt-4 flex flex-col gap-4">
        {step === 0 && <StepDetails draft={draft} patch={patch} />}
        {step === 1 && <StepLocation draft={draft} patch={patch} courts={courts} />}
        {step === 2 && (
          <StepSchedule
            draft={draft}
            patch={patch}
            months={months}
            days={days}
            availability={availability}
          />
        )}
        {step === 3 && <StepPlayers draft={draft} patch={patch} players={players} />}
        {step === 4 && <StepSettings draft={draft} patch={patch} />}
        {step === 5 && (
          <StepReview draft={draft} courts={courts} months={months} days={days} players={players} />
        )}
        {/* clearance for the fixed footer */}
        <div className="h-24" aria-hidden />
      </div>

      <WizardFooter
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
