"use client";

import { useAuth } from "@/lib/api/useAuth";
import ProfileAvatar from "./ProfileAvatar";

/** Profile avatar wired to the live /players/me photo (default silhouette when unset). */
export default function ProfileAvatarLive() {
  const { player } = useAuth();
  return <ProfileAvatar src={player?.avatarUrl} />;
}
