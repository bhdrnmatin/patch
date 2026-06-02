"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StorySlide from "./_components/StorySlide";

const slides = [
  {
    backgroundImage:
      "https://www.figma.com/api/mcp/asset/bb173329-281e-4694-a3db-d3dcf0c2100f",
    title: "هم‌بازی مناسب، بدون دردسر",
    description:
      "با چند پاسخ کوتاه، سطح بازی‌ات مشخص می‌شود و پیشنهاد هم‌تیمی/حریف هم‌سطح می‌گیری.",
  },
  {
    backgroundImage:
      "https://www.figma.com/api/mcp/asset/c7147ddc-f374-4225-96c0-481bffee592a",
    title: "پیدا کن، بازی کن",
    description:
      "زمین رزرو کن و با بازیکنان هم‌سطح در اطرافت وصل شو.",
  },
  {
    backgroundImage:
      "https://www.figma.com/api/mcp/asset/3b2946ce-d2b6-442f-ba2e-7e951fb2402e",
    title: "بازی کن و رقابت کن",
    description:
      "از بازی دوستانه تا چالش و تور محلی. نتایج ثبت می‌شود و جدول‌ها به‌روز می‌مانند.",
  },
  {
    backgroundImage:
      "https://www.figma.com/api/mcp/asset/c487e7e7-a410-424f-81ca-54d88ebde3e0",
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
      <div className="relative w-[390px] h-[844px]">
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
