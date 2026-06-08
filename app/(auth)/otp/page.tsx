"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import OtpInput from "../_components/OtpInput";
import AuthActions from "../_components/AuthActions";

const BG = "/images/auth-otp.png";

function OtpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const [otp, setOtp] = useState("");

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
          <AuthActions nextLabel="ورود" onNext={handleNext} />
        </div>
      </AuthCard>
    </AuthSlide>
  );
}

export default function OtpPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black"
      style={{ fontFamily: "var(--font-vazirmatn), Arial, sans-serif" }}
    >
      <div className="relative w-full min-h-dvh">
        <Suspense>
          <OtpContent />
        </Suspense>
      </div>
    </div>
  );
}
