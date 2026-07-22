"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import AuthSlide from "../_components/AuthSlide";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthSelect, { type SelectOption } from "../_components/AuthSelect";
import AuthActions from "../_components/AuthActions";
import { updateProfile } from "@/lib/api/players";
import { getCities, getProvinces } from "@/lib/api/geo";
import { ApiError } from "@/lib/api/client";
import { toPersianOnly } from "@/lib/persian";

const BG = "/images/auth-profile-setup.webp";

// Displayed in Persian; the value is the backend enum sent as-is.
const GENDER_OPTIONS: SelectOption[] = [
  { value: "MALE", label: "آقا" },
  { value: "FEMALE", label: "خانم" },
];

// Usernames are Latin handles — strip everything but a-z 0-9 . _
const sanitizeUsername = (v: string) => v.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();

export default function ProfileSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    username: "",
    provinceId: "",
    cityId: "",
  });

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const provincesQuery = useQuery({ queryKey: ["provinces"], queryFn: getProvinces });
  const citiesQuery = useQuery({
    queryKey: ["cities", form.provinceId],
    queryFn: () => getCities(form.provinceId),
    enabled: Boolean(form.provinceId),
  });
  const provinces = provincesQuery.data ?? [];
  const cities = citiesQuery.data ?? [];

  const provinceOptions: SelectOption[] = provinces.map((p) => ({ value: p.id, label: p.name }));
  const cityOptions: SelectOption[] = cities.map((c) => ({ value: c.id, label: c.name }));

  const provincePlaceholder = provincesQuery.isLoading
    ? "در حال بارگذاری..."
    : provinces.length === 0
      ? "استانی یافت نشد"
      : "انتخاب";
  const cityPlaceholder = !form.provinceId
    ? "ابتدا استان"
    : citiesQuery.isLoading
      ? "در حال بارگذاری..."
      : cities.length === 0
        ? "شهری یافت نشد"
        : "انتخاب";
  const geoError =
    provincesQuery.error instanceof ApiError
      ? `استان: ${provincesQuery.error.message}`
      : citiesQuery.error instanceof ApiError
        ? `شهر: ${citiesQuery.error.message}`
        : null;

  // residenceCityId (cityId) is what the API needs; province just scopes the city list.
  const isComplete =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.gender !== "" &&
    form.username.trim() !== "" &&
    form.cityId !== "";

  // Submit-time guard: the live filter can slip on some mobile keyboards, so
  // block if a name still contains Latin, and always send the cleaned value.
  const nameError =
    /[a-zA-Z]/.test(form.firstName) || /[a-zA-Z]/.test(form.lastName)
      ? "نام و نام خانوادگی باید فارسی باشند."
      : null;

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      updateProfile({
        firstName: toPersianOnly(form.firstName),
        lastName: toPersianOnly(form.lastName),
        gender: form.gender,
        username: form.username,
        residenceCityId: form.cityId,
      }),
    onSuccess: () => router.push("/assessment"),
  });

  const errorMessage =
    error instanceof ApiError ? error.message : error ? "خطا در ثبت اطلاعات. دوباره تلاش کنید." : null;

  const onProvince = (id: string) => setForm((f) => ({ ...f, provinceId: id, cityId: "" }));

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
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <AuthInput placeholder="عشاقی" label="نام خانوادگی" value={form.lastName} onChange={set("lastName")} showLabel persianOnly />
                  <AuthInput placeholder="سینا" label="نام" value={form.firstName} onChange={set("firstName")} showLabel persianOnly />
                </div>
                <div className="flex gap-4">
                  <AuthInput
                    placeholder="sina_padel"
                    label="نام کاربری"
                    value={form.username}
                    onChange={(v) => set("username")(sanitizeUsername(v))}
                    showLabel
                  />
                  <AuthSelect
                    label="جنسیت"
                    placeholder="انتخاب"
                    value={form.gender}
                    onChange={set("gender")}
                    options={GENDER_OPTIONS}
                    showLabel
                  />
                </div>
                <div className="flex gap-4">
                  <AuthSelect
                    label="شهر"
                    placeholder={cityPlaceholder}
                    value={form.cityId}
                    onChange={set("cityId")}
                    options={cityOptions}
                    showLabel
                  />
                  <AuthSelect
                    label="استان"
                    placeholder={provincePlaceholder}
                    value={form.provinceId}
                    onChange={onProvince}
                    options={provinceOptions}
                    showLabel
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {(nameError || geoError || errorMessage) && (
                  <p className="text-xs text-danger text-center" dir="rtl">
                    {nameError ?? geoError ?? errorMessage}
                  </p>
                )}
                <AuthActions
                  nextLabel={isPending ? "در حال ثبت..." : "شروع کنیم!"}
                  onNext={() => mutate()}
                  disabled={!isComplete || isPending || !!nameError}
                />
              </div>
            </div>
          </AuthCard>
        </AuthSlide>
      </div>
    </div>
  );
}
