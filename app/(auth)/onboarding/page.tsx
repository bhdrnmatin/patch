"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StorySlide from "./_components/StorySlide";

const slides = [
  {
    backgroundImage: "/images/onboarding-1.png",
    title: "هم‌بازی مناسب، بدون دردسر",
    description:
      "با چند پاسخ کوتاه، سطح بازی‌ات مشخص می‌شود و پیشنهاد هم‌تیمی/حریف هم‌سطح می‌گیری.",
  },
  {
    backgroundImage: "/images/onboarding-2.png",
    title: "پیدا کن، بازی کن",
    description:
      "زمین رزرو کن و با بازیکنان هم‌سطح در اطرافت وصل شو.",
  },
  {
    backgroundImage: "/images/onboarding-3.png",
    title: "بازی کن و رقابت کن",
    description:
      "از بازی دوستانه تا چالش و تور محلی. نتایج ثبت می‌شود و جدول‌ها به‌روز می‌مانند.",
  },
  {
    backgroundImage: "/images/onboarding-4.png",
    title: "برنامه‌ریزی هوشمند",
    description:
      "تقویم یکپارچه و اعلان‌های به‌موقع کمک می‌کند هیچ بازی‌ای را از دست ندهی.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current === slides.length - 1) {
      router.push("/");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  const slide = slides[current];

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black"
      style={{ fontFamily: "var(--font-vazirmatn), Arial, sans-serif" }}
    >
      <div className="relative w-full min-h-dvh">
        <StorySlide
          backgroundImage={slide.backgroundImage}
          title={slide.title}
          description={slide.description}
          total={slides.length}
          current={current}
          isLast={current === slides.length - 1}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}
