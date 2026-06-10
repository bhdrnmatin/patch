"use client";

import { useRouter } from "next/navigation";

interface Props {
  title: string;
  onBack?: () => void;
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PageHeader({ title, onBack }: Props) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handleBack}
        className="size-12 flex items-center justify-center rounded-full border border-edge text-ink-soft backdrop-blur-sm shrink-0"
        aria-label="برگشت"
      >
        <ChevronLeft />
      </button>
      <h1 className="text-2xl font-bold text-ink-soft leading-8" dir="rtl">
        {title}
      </h1>
    </div>
  );
}
