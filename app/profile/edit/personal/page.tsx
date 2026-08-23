"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SubPageLayout from "../../_components/SubPageLayout";
import ProfileAvatar from "../../_components/ProfileAvatar";
import TextField from "../../../matches/create/_components/TextField";
import SelectField from "../../../matches/create/_components/SelectField";
import OptionSheet from "../../../matches/create/_components/OptionSheet";
import { ApiError } from "@/lib/api/client";
import {
  getMe,
  updateDisplayInfo,
  updateProfile,
  uploadProfilePhoto,
} from "@/lib/api/players";
import { getCities, getProvinces } from "@/lib/api/geo";
import type { PlayerResponse, PreferredSide } from "@/lib/api/types";
import { toPersianOnly } from "@/lib/persian";

const SIDE_OPTIONS = [
  { id: "RIGHT", label: "راست" },
  { id: "LEFT", label: "چپ" },
];

export default function PersonalInfoPage() {
  const { data: player, isLoading } = useQuery({ queryKey: ["me"], queryFn: getMe });

  return (
    <SubPageLayout title="اطلاعات فردی">
      {isLoading || !player ? (
        <p className="text-sm text-muted text-center py-10" dir="rtl">
          در حال بارگذاری...
        </p>
      ) : (
        // Mount the form only once the profile is loaded, so the fields prefill
        // from useState initializers (no setState-in-effect sync).
        <PersonalInfoForm player={player} />
      )}
    </SubPageLayout>
  );
}

type SheetName = "side" | "province" | "city" | null;

function PersonalInfoForm({ player }: { player: PlayerResponse }) {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(player.firstName ?? "");
  const [lastName, setLastName] = useState(player.lastName ?? "");
  const [bio, setBio] = useState(player.bio ?? "");
  const [side, setSide] = useState<PreferredSide | "">(player.preferredSide ?? "");
  // Residence: we only have the current cityId (no name/province), so the
  // pickers start empty and we keep the existing id unless the user changes it.
  // ponytail: no reverse cityId→name lookup, add if the current city must show.
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [sheet, setSheet] = useState<SheetName>(null);

  const provincesQuery = useQuery({ queryKey: ["provinces"], queryFn: getProvinces });
  const citiesQuery = useQuery({
    queryKey: ["cities", provinceId],
    queryFn: () => getCities(provinceId),
    enabled: Boolean(provinceId),
  });
  const provinces = provincesQuery.data ?? [];
  const cities = citiesQuery.data ?? [];

  const provinceName = provinces.find((p) => p.id === provinceId)?.name;
  const cityName = cities.find((c) => c.id === cityId)?.name;
  const sideLabel = SIDE_OPTIONS.find((o) => o.id === side)?.label;

  const photo = useMutation({
    mutationFn: (file: File) => uploadProfilePhoto(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const save = useMutation({
    mutationFn: async () => {
      await updateProfile({
        firstName: toPersianOnly(firstName).trim(),
        lastName: toPersianOnly(lastName).trim(),
        gender: player.gender, // unchanged here, but the endpoint requires it
        residenceCityId: cityId || player.residenceCityId,
      });
      return updateDisplayInfo({ bio, preferredSide: side || undefined });
    },
    // Refetch /me so every field (name/city from the profile PUT, side/bio from
    // display-info) reflects true server state, not just the last response.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (file) photo.mutate(file);
  };

  const errorOf = (e: unknown) =>
    e instanceof ApiError ? e.message : e ? "خطایی رخ داد. دوباره تلاش کنید." : null;
  const photoError = errorOf(photo.error);
  const saveError = errorOf(save.error);
  const canSave = firstName.trim() !== "" && lastName.trim() !== "" && !save.isPending;

  return (
    <div className="flex flex-col gap-8 w-full pb-[calc(6rem+var(--safe-b))]">
      {/* Profile photo — avatar is the tap target, camera badge signals it's editable */}
      <div className="flex flex-col items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={onPickFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={photo.isPending}
          aria-label="تغییر تصویر پروفایل"
          className="relative rounded-full disabled:opacity-60 active:opacity-80"
        >
          <ProfileAvatar src={player.avatarUrl} />
          <span className="absolute bottom-0 right-0 size-8 rounded-full bg-primary border-2 border-surface flex items-center justify-center text-white">
            <CameraIcon />
          </span>
        </button>
        <span className="text-xs text-muted" dir="rtl">
          {photo.isPending ? "در حال آپلود..." : "برای تغییر تصویر بزنید"}
        </span>
        {photoError && (
          <p className="text-xs text-danger" dir="rtl">
            {photoError}
          </p>
        )}
      </div>

      {/* Identity */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="مشخصات" icon={<PersonIcon />} />
        <TextField
          label="نام"
          value={firstName}
          onChange={(v) => setFirstName(toPersianOnly(v))}
          placeholder="سینا"
        />
        <TextField
          label="نام خانوادگی"
          value={lastName}
          onChange={(v) => setLastName(toPersianOnly(v))}
          placeholder="عشاقی"
        />
        <SelectField
          label="ساید ترجیحی"
          value={sideLabel}
          placeholder="انتخاب کنید"
          onClick={() => setSheet("side")}
        />
      </section>

      {/* Residence: province → city */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="محل سکونت" icon={<PinIcon />} />
        <SelectField
          label="استان"
          value={provinceName}
          placeholder={provincesQuery.isLoading ? "در حال بارگذاری..." : "انتخاب کنید"}
          onClick={() => setSheet("province")}
        />
        <SelectField
          label="شهر"
          value={cityName}
          placeholder={
            !provinceId
              ? "ابتدا استان را انتخاب کنید"
              : citiesQuery.isLoading
                ? "در حال بارگذاری..."
                : "انتخاب کنید"
          }
          onClick={() => provinceId && setSheet("city")}
        />
      </section>

      {/* Bio */}
      <section className="flex flex-col gap-3">
        <SectionHeader title="بیوگرافی" icon={<PenIcon />} />
        <textarea
          aria-label="بیوگرافی"
          value={bio}
          onChange={(e) => setBio(toPersianOnly(e.target.value))}
          dir="rtl"
          rows={4}
          placeholder="چند خط درباره خودت بنویس"
          className="w-full rounded-card bg-white border border-edge p-4 text-sm text-ink-soft placeholder-muted resize-none focus:outline-none focus:border-primary shadow-card"
        />
      </section>

      {/* Sticky save bar — primary action always reachable */}
      <div className="fixed-bar fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-t border-edge rounded-t-group px-6 pt-3 pb-[calc(1.5rem+var(--safe-b))] flex flex-col items-center gap-2 shadow-sheet">
        {saveError && (
          <p className="text-xs text-danger" dir="rtl">
            {saveError}
          </p>
        )}
        {save.isSuccess && !save.isPending && (
          <p className="text-xs text-success" dir="rtl">
            تغییرات ذخیره شد
          </p>
        )}
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={!canSave}
          className="w-full bg-primary rounded-card px-4 py-3 text-sm font-bold leading-4 text-white active:opacity-90 disabled:opacity-50"
          dir="rtl"
        >
          {save.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>

      <OptionSheet
        open={sheet === "side"}
        title="ساید ترجیحی"
        options={SIDE_OPTIONS}
        value={side || null}
        onSelect={(id) => {
          setSide(id as PreferredSide);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        open={sheet === "province"}
        title="انتخاب استان"
        searchable
        searchPlaceholder="جستجوی استان..."
        options={provinces.map((p) => ({ id: p.id, label: p.name }))}
        value={provinceId || null}
        onSelect={(id) => {
          setProvinceId(id);
          setCityId(""); // province changed — clear the stale city
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        open={sheet === "city"}
        title="انتخاب شهر"
        searchable
        searchPlaceholder="جستجوی شهر..."
        options={cities.map((c) => ({ id: c.id, label: c.name }))}
        value={cityId || null}
        onSelect={(id) => {
          setCityId(id);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2.5">
      <h2 className="text-base font-bold text-ink" dir="rtl">
        {title}
      </h2>
      <span className="size-7 shrink-0 flex items-center justify-center rounded-full bg-primary text-white">
        {icon}
      </span>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8.5A1.5 1.5 0 0 1 5.5 7h1.2c.5 0 .96-.26 1.24-.68l.62-.94A1.5 1.5 0 0 1 10.8 4.7h2.4c.5 0 .97.25 1.24.68l.62.94c.28.42.74.68 1.24.68h1.2A1.5 1.5 0 0 1 19 8.5v8A1.5 1.5 0 0 1 17.5 18h-11A1.5 1.5 0 0 1 5 16.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 20c0-3.31-3.13-6-7-6s-7 2.69-7 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 13a2.6 2.6 0 1 0 0-5.2A2.6 2.6 0 0 0 12 13Z" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.35 8.4c1.64-7.2 13.67-7.2 15.3.01.96 4.23-1.67 7.81-3.98 10.03a5 5 0 0 1-6.99 0C6.36 16.22 3.73 12.64 4.35 8.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16.5 4.5l3 3M4 20l1-4L16.5 4.5a1.5 1.5 0 0 1 2.12 0l1.38 1.38a1.5 1.5 0 0 1 0 2.12L8.5 19 4 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
