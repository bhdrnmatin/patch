"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthActions from "../_components/AuthActions";
import { updateProfile } from "@/lib/api/players";
import { ApiError } from "@/lib/api/client";

const BG = "/images/auth-profile-setup.webp";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", city: "", gender: "" });

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const isComplete = Object.values(form).every((v) => v.trim() !== "");

  const { mutate, isPending, error } = useMutation({
    // The API profile takes only name + gender. `city` is collected for later
    // (no field for it yet) and the assessment stays local/deferred.
    // TODO(gender): confirm the accepted gender string (raw Persian vs an enum)
    // against the live API and map here if needed.
    mutationFn: () =>
      updateProfile({ firstName: form.firstName, lastName: form.lastName, gender: form.gender }),
    onSuccess: () => router.push("/assessment"),
  });

  const errorMessage =
    error instanceof ApiError ? error.message : error ? "خطا در ثبت اطلاعات. دوباره تلاش کنید." : null;

  return (
    <div
      className="flex items-center justify-center h-dvh overflow-hidden bg-black"
      style={{ fontFamily: "var(--font-yekan-bakh), Arial, sans-serif" }}
    >
      <div className="relative w-full max-w-[430px] h-full">
        <AuthSlide backgroundImage={BG} objectPosition="35% 50%">
          <AuthCard
            title="خوش اومدی!"
            subtitle="بهترین سرمایه‌گذاری روی خودت رو شروع کردی ..."
          >
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <AuthInput placeholder="عشاقی" label="نام خانوادگی" value={form.lastName} onChange={set("lastName")} showLabel />
                  <AuthInput placeholder="سینا" label="نام" value={form.firstName} onChange={set("firstName")} showLabel />
                </div>
                <div className="flex gap-4">
                  <AuthInput placeholder="تهران" label="شهر" value={form.city} onChange={set("city")} showLabel />
                  <AuthInput placeholder="آقا" label="جنسیت" value={form.gender} onChange={set("gender")} showLabel />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {errorMessage && (
                  <p className="text-xs text-danger text-center" dir="rtl">
                    {errorMessage}
                  </p>
                )}
                <AuthActions
                  nextLabel={isPending ? "در حال ثبت..." : "شروع کنیم!"}
                  onNext={() => mutate()}
                  disabled={!isComplete || isPending}
                />
              </div>
            </div>
          </AuthCard>
        </AuthSlide>
      </div>
    </div>
  );
}
