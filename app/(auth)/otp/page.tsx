"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import OtpInput from "../_components/OtpInput";
import AuthActions from "../_components/AuthActions";

const BG = "/images/auth-otp.webp";

function OtpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const [otp, setOtp] = useState("");

  // Field completeness only; the code's correctness is verified by the API.
  const isComplete = otp.length === 5;

  const handleNext = () => {
    router.push("/profile-setup");
  };

  return (
    <AuthSlide backgroundImage={BG}>
      <AuthCard
        title="ارسال کد"
        subtitle={`لطفا کد ارسال شده به شماره ${phone} را وارد کنید`}
      >
        <div className="flex flex-col gap-4">
          <OtpInput value={otp} onChange={setOtp} />
          <AuthActions nextLabel="ورود" onNext={handleNext} disabled={!isComplete} />
        </div>
      </AuthCard>
    </AuthSlide>
  );
}

export default function OtpPage() {
  return (
    <div
      className="flex items-center justify-center h-dvh overflow-hidden bg-black"
      style={{ fontFamily: "var(--font-yekan-bakh), Arial, sans-serif" }}
    >
      <div className="relative w-full max-w-[430px] h-full">
        <Suspense>
          <OtpContent />
        </Suspense>
      </div>
    </div>
  );
}
