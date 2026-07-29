"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StorySlide from "./_components/StorySlide";

const slides = [
  {
    backgroundImage: "/images/onboarding-1.webp",
    title: "پدل با آدم‌های مناسب، لذت‌بخش‌تره",
    description:
      "بازیکن‌هایی رو بهت پیشنهاد میدیم که احتمال یک بازی خوب باهاشون بیشتره.",
  },
  {
    backgroundImage: "/images/onboarding-2.webp",
    title: "رزرو زمین در چند ثانیه",
    description:
      "زمان‌های خالی، قیمت و موقعیت باشگاه‌ها رو ببین و همون‌جا رزروت رو انجام بده.",
  },
  {
    backgroundImage: "/images/onboarding-3.webp",
    title: "هر بازی بخشی از مسیرته",
    description:
      "نتیجه‌ی بازی‌هات ثبت می‌شن تا پیشرفتت رو در طول زمان ببینی.",
  },
  {
    backgroundImage: "/images/onboarding-4.webp",
    title: "جای تو بین ما خالی بود!",
    description:
      "به پَچ خوش اومدی.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current === slides.length - 1) {
      router.push("/login");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  const slide = slides[current];

  return (
    <div
      className="flex items-center justify-center h-dvh overflow-hidden bg-black"
      style={{ fontFamily: "var(--font-yekan-bakh), Arial, sans-serif" }}
    >
      <div className="relative w-full max-w-[430px] h-full">
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
