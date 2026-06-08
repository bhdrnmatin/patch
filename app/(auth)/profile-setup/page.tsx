"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthActions from "../_components/AuthActions";

const BG = "/images/auth-profile-setup.webp";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", city: "", gender: "" });

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black"
      style={{ fontFamily: "var(--font-vazirmatn), Arial, sans-serif" }}
    >
      <div className="relative w-full min-h-dvh">
        <AuthSlide backgroundImage={BG}>
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
              <AuthActions nextLabel="شروع کنیم!" onNext={() => router.push("/assessment")} />
            </div>
          </AuthCard>
        </AuthSlide>
      </div>
    </div>
  );
}
