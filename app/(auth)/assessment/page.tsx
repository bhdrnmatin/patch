"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import RadioGroup from "../_components/RadioGroup";
import AuthActions from "../_components/AuthActions";

const steps = [
  {
    bg: "https://www.figma.com/api/mcp/asset/21f4e98d-42fd-4c33-be72-78ebfc5e05fd",
    title: "سنجش سطح",
    subtitle: "در مقیاس زیر، خودتان را کجا قرار می‌دهید؟",
    options: ["مبتدی", "متوسط", "پیشرفته", "حرفه‌ای"],
    nextLabel: "بریم بعدی",
  },
  {
    bg: "https://www.figma.com/api/mcp/asset/659423ff-036e-4765-8557-4cbf5983770d",
    title: "سابقه‌ی پدل",
    subtitle: "چند سال است پدل یا هر ورزشِ راکتی انجام می‌دهید؟",
    options: [
      "تا حالا بازی نکرده‌ام",
      "کمتر از ۱ سال",
      "بین ۱ تا ۳ سال",
      "بین ۳ تا ۵ سال",
      "بیش از ۵ سال",
    ],
    nextLabel: "بریم بعدی",
  },
  {
    bg: "https://www.figma.com/api/mcp/asset/c2eceb8f-994b-4fbf-9993-d1c2a7b649eb",
    title: "بازه‌ی سنی",
    subtitle: "سن شما چند است؟",
    options: ["۱۸ تا ۳۰ سال", "۳۱ تا ۴۰ سال", "۴۱ تا ۵۰ سال", "بالای ۵۰ سال"],
    nextLabel: "بریم بعدی",
  },
  {
    bg: "https://www.figma.com/api/mcp/asset/a3a39df0-3e7f-4213-b26a-afefc1afea92",
    title: "مهارت روی «والی»",
    subtitle: "در والی…",
    options: [
      "به‌ندرت به تور می‌آیم",
      "کنار تور احساس امنیت نمی‌کنم و خطا زیاد می‌دهم",
      "فورهند و بک‌هند والی را با کمی سختی می‌زنم",
      "جای‌گیری خوبی کنار تور دارم و با اطمینان والی می‌زنم",
      "والی‌های عمیق و پرقدرت می‌زنم",
    ],
    nextLabel: "بریم بعدی",
  },
  {
    bg: "https://www.figma.com/api/mcp/asset/f5eb003b-56d9-42da-8129-c071ac4d7aca",
    title: "توپ‌های برگشتی از دیوار",
    subtitle: "در ضربات پس از برخورد توپ به دیوار…",
    options: [
      "با سختی، برگشت‌های دیوارِ پشتی را می‌زنم",
      "برگشت‌های دیوارِ پشتی را می‌زنم ولی برگشت‌های «دو دیوار» برایم دشوار است",
      "برگشت‌های «دو دیوار» را برمی‌گردانم و به برگشت‌های سریع می‌رسم",
      "ضربه‌های «باجادا» (فرود از دیوار) را با فورهند و بک‌هندِ قدرتمند اجرا می‌کنم",
    ],
    nextLabel: "تموم شد!",
  },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(""));

  const current = steps[step];

  const handleNext = () => {
    if (step === steps.length - 1) {
      router.push("/");
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black"
      style={{ fontFamily: "var(--font-vazirmatn), Arial, sans-serif" }}
    >
      <div className="relative w-[390px] h-[845px]">
        <AuthSlide backgroundImage={current.bg}>
          <AuthCard title={current.title} subtitle={current.subtitle}>
            <div className="flex flex-col gap-4">
              <RadioGroup
                options={current.options}
                value={answers[step]}
                onChange={(val) =>
                  setAnswers((a) => {
                    const next = [...a];
                    next[step] = val;
                    return next;
                  })
                }
              />
              <AuthActions
                nextLabel={current.nextLabel}
                onNext={handleNext}
                onBack={step > 0 ? handleBack : undefined}
              />
            </div>
          </AuthCard>
        </AuthSlide>
      </div>
    </div>
  );
}
