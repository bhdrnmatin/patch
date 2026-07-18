"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthActions from "../_components/AuthActions";
import { requestOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useRedirectIfAuthed } from "@/lib/api/useAuth";
import { toLatinDigits } from "@/lib/persian";

const BG = "/images/auth-login.webp";

export default function LoginPage() {
  useRedirectIfAuthed();
  const router = useRouter();
  const [phone, setPhone] = useState("");

  // Iranian mobile: 11 Persian digits starting with ۰۹ (AuthInput stores Persian digits).
  const isValidPhone = /^۰۹[۰-۹]{9}$/.test(phone);

  const { mutate, isPending, error } = useMutation({
    // The API needs Latin digits; pass the same normalized number to /otp so the
    // OTP page can verify against it.
    mutationFn: () => requestOtp(toLatinDigits(phone)),
    onSuccess: () =>
      router.push(`/otp?phone=${encodeURIComponent(toLatinDigits(phone))}`),
  });

  const errorMessage =
    error instanceof ApiError ? error.message : error ? "خطا در ارسال کد. دوباره تلاش کنید." : null;

  const handleNext = () => mutate();

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
              {errorMessage && (
                <p className="text-xs text-danger text-center" dir="rtl">
                  {errorMessage}
                </p>
              )}
              <AuthActions
                nextLabel={isPending ? "در حال ارسال..." : "ارسال کد"}
                onNext={handleNext}
                disabled={!isValidPhone || isPending}
              />
            </div>
          </AuthCard>
        </AuthSlide>
      </div>
    </div>
  );
}
