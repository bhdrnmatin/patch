"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SubPageLayout from "../../_components/SubPageLayout";
import ProfileAvatar from "../../_components/ProfileAvatar";
import Button from "../../../(auth)/_components/Button";
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
    <div className="flex flex-col gap-8 w-full">
      {/* Profile photo */}
      <div className="flex flex-col items-center gap-3">
        <ProfileAvatar src={player.avatarUrl} />
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
          className="text-sm text-primary font-bold disabled:opacity-50"
          dir="rtl"
        >
          {photo.isPending ? "در حال آپلود..." : "تغییر تصویر پروفایل"}
        </button>
        {photoError && (
          <p className="text-xs text-danger" dir="rtl">
            {photoError}
          </p>
        )}
      </div>

      {/* Name */}
      <div className="flex flex-col gap-4 w-full">
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

        {/* Preferred side */}
        <SelectField
          label="ساید ترجیحی"
          value={sideLabel}
          placeholder="انتخاب کنید"
          onClick={() => setSheet("side")}
        />

        {/* Residence: province → city */}
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
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="bio" className="text-sm font-bold text-ink-soft text-right px-1" dir="rtl">
          بیوگرافی
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(toPersianOnly(e.target.value))}
          dir="rtl"
          rows={4}
          placeholder="چند خط درباره خودت بنویس"
          className="w-full rounded-card bg-white border border-edge p-4 text-sm text-ink-soft placeholder-muted resize-none focus:outline-none focus:border-primary shadow-card"
        />
      </div>

      {saveError && (
        <p className="text-xs text-danger px-1 text-center" dir="rtl">
          {saveError}
        </p>
      )}
      {save.isSuccess && !save.isPending && (
        <p className="text-xs text-success px-1 text-center" dir="rtl">
          ذخیره شد
        </p>
      )}
      <Button
        label={save.isPending ? "در حال ذخیره..." : "ذخیره"}
        variant="primary"
        onClick={() => save.mutate()}
        disabled={!canSave}
        fullWidth
      />

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
