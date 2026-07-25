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
 * the passed-in placeholders. While /players/me is loading we show a skeleton
 * bar rather than the mock name, so a real-looking placeholder never flashes
 * before the user's own name resolves.
 */
export default function ProfileIdentity({ fallbackName, city }: Props) {
  const { player, isLoading } = useAuth();
  const apiName = player ? `${player.firstName} ${player.lastName}`.trim() : "";
  const name = apiName || fallbackName;
  // Live gender (MALE/FEMALE → آقا/خانم, matching profile-setup labels).
  const gender =
    player?.gender === "MALE" ? "آقا" : player?.gender === "FEMALE" ? "خانم" : "—";

  return (
    <div className="flex flex-col gap-1 items-end w-full">
      <div className="flex flex-col items-end">
        {isLoading && !apiName ? (
          <span
            className="h-7 w-32 rounded bg-edge/70 animate-pulse"
            aria-label="در حال بارگذاری"
          />
        ) : (
          <span className="text-story-title font-bold text-ink-soft" dir="rtl">
            {name}
          </span>
        )}
        {player?.username && (
          <span className="text-xs text-ink-soft" dir="ltr">
            @{player.username}
          </span>
        )}
      </div>
      <ProfileMeta city={city} gender={gender} />
      {player?.bio && (
        <p className="text-sm text-ink-soft text-right leading-6 mt-1" dir="rtl">
          {player.bio}
        </p>
      )}
    </div>
  );
}
