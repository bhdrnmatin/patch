"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { logout as apiLogout } from "./auth";
import { getMe } from "./players";
import type { PlayerResponse } from "./types";
import { hasSession, subscribeSession } from "./session";
import { POST_AUTH_ROUTE } from "../routes";

/**
 * Shared options for the cached /me query. Both useAuth and useRequireAuth
 * observe this exact key, so the options must match or their refetch behavior
 * diverges — keep them here, once.
 */
const meQuery = {
  queryKey: ["me"] as const,
  queryFn: getMe,
  // Don't churn the session on a transient 401 from this flaky backend, and
  // don't refetch on tab refocus.
  refetchOnWindowFocus: false,
  staleTime: 5 * 60 * 1000,
  // No retry: every guarded route blocks on this query, so a down backend would
  // cost two request timeouts plus backoff before the guard's error path lets
  // the user through. One failure is enough to know.
  retry: false,
} as const;

/** A completed profile can use the app; anything else is sent to /profile-setup. */
export function isProfileComplete(player: Pick<PlayerResponse, "profileStatus">): boolean {
  return player.profileStatus?.toLowerCase() === "complete";
}

/** Reactive "is there a token?" — re-renders on login/logout. */
function useHasSession(): boolean {
  return useSyncExternalStore(subscribeSession, hasSession, () => false);
}

/** False during SSR and first paint, true once mounted — no effect/setState. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/** Current auth state + the signed-in player (fetched only when authenticated). */
export function useAuth() {
  const isAuthenticated = useHasSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: player, isLoading } = useQuery({ ...meQuery, enabled: isAuthenticated });

  const logout = useCallback(async () => {
    // apiLogout clears the local session even if the server call fails; swallow
    // any error so we always clear the cache and redirect.
    try {
      await apiLogout();
    } catch {
      // already logged out locally
    }
    queryClient.removeQueries({ queryKey: ["me"] });
    router.replace("/login");
  }, [queryClient, router]);

  return { isAuthenticated, player, isLoading, logout };
}

/**
 * Gate a protected route. localStorage is client-only, so we stay "checking"
 * through SSR/first paint, then resolve to "authed" or redirect to /login.
 * Also enforces a completed profile: an authenticated user whose /me reports
 * profileStatus !== "complete" is sent to /profile-setup.
 *
 * Holding a token is enough to render — we do NOT wait for /players/me. It only
 * decides whether to bounce an incomplete profile to /profile-setup, and paying
 * for that answer up front means a slow or dead backend holds every guarded
 * page on a spinner for a full request timeout, on every mount (a failed query
 * refetches). The trade is that a genuinely incomplete profile sees the app for
 * a moment before the redirect lands, which only happens right after signup.
 * The only effect is the navigation side-effect — no setState-in-effect.
 */
export function useRequireAuth(): "checking" | "authed" {
  const router = useRouter();
  const hydrated = useHydrated();
  const authed = useHasSession();

  const { data: player } = useQuery({ ...meQuery, enabled: hydrated && authed });

  // Only redirect on a definitively-incomplete profile; an errored/absent /me
  // leaves this false so we don't bounce users on a transient backend failure.
  const incomplete = player ? !isProfileComplete(player) : false;

  useEffect(() => {
    if (!hydrated) return;
    if (!authed) router.replace("/login");
    else if (incomplete) router.replace("/profile-setup");
  }, [hydrated, authed, incomplete, router]);

  if (!(hydrated && authed)) return "checking";
  if (incomplete) return "checking"; // redirecting to /profile-setup
  return "authed";
}

/** For public auth pages (login/otp): send already-signed-in users into the app. */
export function useRedirectIfAuthed(): void {
  const router = useRouter();

  useEffect(() => {
    if (hasSession()) router.replace(POST_AUTH_ROUTE);
  }, [router]);
}
