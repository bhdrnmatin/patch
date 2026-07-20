"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SubPageLayout from "../../_components/SubPageLayout";
import ProfileAvatar from "../../_components/ProfileAvatar";
import Button from "../../../(auth)/_components/Button";
import { ApiError } from "@/lib/api/client";
import { getMe, updateDisplayInfo, uploadProfilePhoto } from "@/lib/api/players";
import type { PlayerResponse } from "@/lib/api/types";

const AVATAR_FALLBACK = "/images/avatar-placeholder.svg";

export default function PersonalInfoPage() {
  const { data: player, isLoading } = useQuery({ queryKey: ["me"], queryFn: getMe });

  return (
    <SubPageLayout title="اطلاعات فردی">
      {isLoading || !player ? (
        <p className="text-sm text-muted text-center py-10" dir="rtl">
          در حال بارگذاری...
        </p>
      ) : (
        // Mount the form only once the profile is loaded, so the bio prefills
        // from a useState initializer (no setState-in-effect sync).
        <PersonalInfoForm player={player} />
      )}
    </SubPageLayout>
  );
}

function PersonalInfoForm({ player }: { player: PlayerResponse }) {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [bio, setBio] = useState(player.bio ?? "");

  const photo = useMutation({
    mutationFn: (file: File) => uploadProfilePhoto(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const save = useMutation({
    mutationFn: () => updateDisplayInfo({ bio }),
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

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Profile photo */}
      <div className="flex flex-col items-center gap-3">
        <ProfileAvatar src={player.avatarUrl || AVATAR_FALLBACK} />
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

      {/* Bio */}
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="bio" className="text-sm text-ink-soft px-1" dir="rtl">
          بیوگرافی
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          dir="rtl"
          rows={4}
          placeholder="چند خط درباره خودت بنویس"
          className="w-full rounded-card bg-white border border-edge p-4 text-sm text-ink-soft placeholder-muted resize-none focus:outline-none focus:border-primary shadow-card"
        />
        {saveError && (
          <p className="text-xs text-danger px-1" dir="rtl">
            {saveError}
          </p>
        )}
        {save.isSuccess && !save.isPending && (
          <p className="text-xs text-success px-1" dir="rtl">
            ذخیره شد
          </p>
        )}
        <Button
          label={save.isPending ? "در حال ذخیره..." : "ذخیره"}
          variant="primary"
          onClick={() => save.mutate()}
          disabled={save.isPending}
          fullWidth
        />
      </div>
    </div>
  );
}
