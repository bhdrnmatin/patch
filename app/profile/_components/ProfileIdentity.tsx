"use client";

import { useAuth } from "@/lib/api/useAuth";
import ProfileMeta from "./ProfileMeta";

interface Props {
  fallbackName: string;
  city: string;
  side: string;
  level: string;
}

/**
 * Name + username + meta block. Name and username come from the live
 * /players/me profile; city/side/level have no API field yet, so they stay as
 * the passed-in placeholders. Falls back to the placeholder name while loading.
 */
export default function ProfileIdentity({ fallbackName, city, side, level }: Props) {
  const { player } = useAuth();
  const apiName = player ? `${player.firstName} ${player.lastName}`.trim() : "";
  const name = apiName || fallbackName;

  return (
    <div className="flex flex-col gap-1 items-end w-full">
      <div className="flex flex-col items-end">
        <span className="text-story-title font-bold text-ink-soft" dir="rtl">
          {name}
        </span>
        {player?.username && (
          <span className="text-xs text-ink-soft" dir="ltr">
            @{player.username}
          </span>
        )}
      </div>
      <ProfileMeta city={city} side={side} level={level} />
      {player?.bio && (
        <p className="text-sm text-ink-soft text-right leading-6 mt-1" dir="rtl">
          {player.bio}
        </p>
      )}
    </div>
  );
}
