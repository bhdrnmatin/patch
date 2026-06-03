"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthActions from "../_components/AuthActions";

const BG =
  "https://www.figma.com/api/mcp/asset/e2b1063a-39fd-49d2-9f95-fe8151c07c6f";

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
      <div className="relative w-[390px] h-[845px]">
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
