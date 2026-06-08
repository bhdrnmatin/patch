"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthActions from "../_components/AuthActions";

const BG = "/images/auth-login.png";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    router.push(`/otp?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black"
      style={{ fontFamily: "var(--font-vazirmatn), Arial, sans-serif" }}
    >
      <div className="relative w-full min-h-dvh">
        <AuthSlide backgroundImage={BG}>
          <AuthCard
            title="ورود"
            subtitle="لطفا شماره موبایل خود را وارد کنید"
          >
            <div className="flex flex-col gap-4">
              <AuthInput
                label="شماره موبایل"
                placeholder="۰۹۳۳۵۵۴۰۰۵۲"
                value={phone}
                onChange={setPhone}
                numeric
                maxLength={11}
              />
              <AuthActions nextLabel="ارسال کد" onNext={handleNext} />
            </div>
          </AuthCard>
        </AuthSlide>
      </div>
    </div>
  );
}
