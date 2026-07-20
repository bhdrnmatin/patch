"use client";

import { useAuth } from "@/lib/api/useAuth";
import ProfileAvatar from "./ProfileAvatar";

const FALLBACK = "/images/avatar-placeholder.svg";

/** Profile avatar wired to the live /players/me photo, with a placeholder fallback. */
export default function ProfileAvatarLive() {
  const { player } = useAuth();
  return <ProfileAvatar src={player?.avatarUrl || FALLBACK} />;
}
