"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import OtpInput from "../_components/OtpInput";
import AuthActions from "../_components/AuthActions";
import { verifyOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getMe } from "@/lib/api/players";
import { useRedirectIfAuthed } from "@/lib/api/useAuth";
import { toLatinDigits, toPersianDigits } from "@/lib/persian";

const BG = "/images/auth-otp.webp";

function OtpContent() {
  useRedirectIfAuthed();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const phone = params.get("phone") ?? ""; // Latin digits, from the login page
  const [otp, setOtp] = useState("");

  // Field completeness only; the code's correctness is verified by the API.
  const isComplete = otp.length === 5;

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => verifyOtp(phone, toLatinDigits(otp)),
    onSuccess: async () => {
      // Tokens are now stored; fetch the profile to decide where to land.
      // Routing off the returned name is robust without pinning the exact
      // profileStatus enum values (confirmed against a live /me later).
      const me = await queryClient.fetchQuery({ queryKey: ["me"], queryFn: getMe });
      const needsSetup = !me.firstName?.trim() || !me.lastName?.trim();
      router.replace(needsSetup ? "/profile-setup" : "/");
    },
  });

  const errorMessage =
    error instanceof ApiError ? error.message : error ? "کد وارد شده نامعتبر است." : null;

  return (
    <AuthSlide backgroundImage={BG}>
      <AuthCard
        title="ارسال کد"
        subtitle={`لطفا کد ارسال شده به شماره ${toPersianDigits(phone)} را وارد کنید`}
      >
        <div className="flex flex-col gap-4">
          <OtpInput value={otp} onChange={setOtp} />
          {errorMessage && (
            <p className="text-xs text-danger text-center" dir="rtl">
              {errorMessage}
            </p>
          )}
          <AuthActions
            nextLabel={isPending ? "در حال بررسی..." : "ورود"}
            onNext={() => mutate()}
            disabled={!isComplete || isPending}
          />
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
