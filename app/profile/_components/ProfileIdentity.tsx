"use client";

import { useAuth } from "@/lib/api/useAuth";
import ProfileAvatarLive from "./ProfileAvatarLive";
import ProfileMeta from "./ProfileMeta";

interface Props {
  fallbackName: string;
  city: string;
  // side/level kept on the page for a later restore; not shown for now.
  side: string;
  level: string;
}

/**
 * Profile identity unit: avatar + name + @handle on one row (the avatar
 * overlaps the hero above via -mt-12), with city/gender as attribute chips
 * below. Name and gender come live from /players/me; a skeleton bar stands in
 * for the name while it loads so the mock fallback never flashes.
 */
export default function ProfileIdentity({ fallbackName, city }: Props) {
  const { player, isLoading } = useAuth();
  const apiName = player ? `${player.firstName} ${player.lastName}`.trim() : "";
  const name = apiName || fallbackName;
  // Live gender (MALE/FEMALE → آقا/خانم, matching profile-setup labels).
  const gender =
    player?.gender === "MALE" ? "آقا" : player?.gender === "FEMALE" ? "خانم" : "—";

  return (
    <div className="relative z-10 w-full flex flex-col items-center">
      {/* Avatar overlaps the hero above */}
      <div className="-mt-12">
        <ProfileAvatarLive />
      </div>

      {/* Name + handle, centered under the avatar */}
      <div className="mt-3 flex flex-col items-center">
        {isLoading && !apiName ? (
          <span
            className="h-8 w-36 rounded bg-edge/70 animate-pulse"
            aria-label="در حال بارگذاری"
          />
        ) : (
          <span className="text-2xl font-bold text-ink leading-tight" dir="rtl">
            {name}
          </span>
        )}
        {player?.username && (
          <span className="text-sm text-muted mt-0.5" dir="ltr">
            @{player.username}
          </span>
        )}
      </div>

      {/* City + gender chips */}
      <div className="mt-3.5">
        <ProfileMeta city={city} gender={gender} />
      </div>

      {player?.bio && (
        <p className="text-sm text-ink-soft text-center leading-6 mt-3 max-w-[300px]" dir="rtl">
          {player.bio}
        </p>
      )}
    </div>
  );
}
