"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthActions from "../_components/AuthActions";
import { requestOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useRedirectIfAuthed } from "@/lib/api/useAuth";
import { withNext } from "@/lib/routes";
import { isValidMobile, toLatinDigits } from "@/lib/persian";

const BG = "/images/auth-login.webp";

function LoginContent() {
  useRedirectIfAuthed();
  const router = useRouter();
  // Set when a share link sent a signed-out visitor here — it rides through the
  // OTP step so they land on the match they were invited to, not on /matches.
  const next = useSearchParams().get("next");
  const [phone, setPhone] = useState("");

  const isValidPhone = isValidMobile(phone);

  const { mutate, isPending, error } = useMutation({
    // The API needs Latin digits; pass the same normalized number to /otp so the
    // OTP page can verify against it.
    mutationFn: () => requestOtp(toLatinDigits(phone)),
    onSuccess: (data) =>
      router.push(
        withNext(
          `/otp?phone=${encodeURIComponent(toLatinDigits(phone))}` +
            `&expires=${encodeURIComponent(data.nextResendAllowedAt)}`,
          next,
        ),
      ),
  });

  const errorMessage =
    error instanceof ApiError ? error.message : error ? "خطا در ارسال کد. دوباره تلاش کنید." : null;

  const handleNext = () => mutate();

  return (
    <div
      className="flex items-center justify-center min-h-[var(--vvh,100dvh)] overflow-hidden bg-black"
      style={{ fontFamily: "var(--font-yekan-bakh), Arial, sans-serif" }}
    >
      <div className="relative w-full max-w-[430px] h-full">
        <AuthSlide backgroundImage={BG} pinTop>
          <AuthCard
            title="ورود"
            subtitle="شماره موبایل خود را وارد کنید"
          >
            <div className="flex flex-col gap-4">
              <AuthInput
                label="شماره موبایل"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                icon={<PhoneIcon />}
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
                nextLabel={isPending ? "در حال ارسال..." : "ادامه"}
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

/**
 * `useSearchParams` opts a page out of static prerendering unless it sits under
 * a Suspense boundary — without this the production build fails outright on
 * this page (it did, from the day `next` was added here). Same wrapper /otp,
 * /matches/[id] and the wizard already use.
 */
export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
