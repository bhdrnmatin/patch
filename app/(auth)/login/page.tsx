"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthActions from "../_components/AuthActions";

const BG = "/images/auth-login.webp";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  // Iranian mobile: 11 Persian digits starting with ۰۹ (AuthInput stores Persian digits).
  const isValidPhone = /^۰۹[۰-۹]{9}$/.test(phone);

  const handleNext = () => {
    router.push(`/otp?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <div
      className="flex items-center justify-center h-dvh overflow-hidden bg-black"
      style={{ fontFamily: "var(--font-yekan-bakh), Arial, sans-serif" }}
    >
      <div className="relative w-full max-w-[430px] h-full">
        <AuthSlide backgroundImage={BG} objectPosition="30% 50%">
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
              <AuthActions nextLabel="ارسال کد" onNext={handleNext} disabled={!isValidPhone} />
            </div>
          </AuthCard>
        </AuthSlide>
      </div>
    </div>
  );
}
