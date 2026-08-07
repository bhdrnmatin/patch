"use client";

import { useAuth } from "@/lib/api/useAuth";
import ProfileMeta from "./ProfileMeta";

interface Props {
  fallbackName: string;
  city: string;
  // level kept on the page for a later restore; not shown for now. (Preferred
  // side is now shown, sourced live from /players/me — not this prop.)
  side: string;
  level: string;
}

/**
 * Profile identity unit: name + city/gender/side chips + bio. The avatar sits
 * in ProfileHero (it straddles the header's bottom edge and collapses with it),
 * so the top padding here is what clears the part that hangs over. Name, gender
 * and side come live from /players/me; a skeleton bar stands in for the name
 * while it loads so the mock fallback never flashes.
 */
export default function ProfileIdentity({ fallbackName, city }: Props) {
  const { player, isLoading } = useAuth();
  const apiName = player ? `${player.firstName} ${player.lastName}`.trim() : "";
  const name = apiName || fallbackName;
  // Live gender (MALE/FEMALE → آقا/خانم, matching profile-setup labels).
  const gender =
    player?.gender === "MALE" ? "آقا" : player?.gender === "FEMALE" ? "خانم" : "—";
  // Live preferred side (RIGHT/LEFT → راست/چپ, matching profile-setup labels).
  const side =
    player?.preferredSide === "RIGHT" ? "راست" : player?.preferredSide === "LEFT" ? "چپ" : "—";

  return (
    // pt clears the 48px of avatar hanging out of the hero above
    <div className="relative z-10 w-full flex flex-col items-end pt-[60px]">
      {/* Name, right-aligned under the avatar */}
      <div className="flex flex-col items-end">
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
      </div>

      {/* City + gender + preferred-side chips */}
      <div className="mt-3.5">
        <ProfileMeta city={city} gender={gender} side={side} />
      </div>

      {player?.bio && (
        <p className="text-sm text-ink-soft text-right leading-6 mt-3" dir="rtl">
          {player.bio}
        </p>
      )}
    </div>
  );
}
