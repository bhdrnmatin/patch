"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { logout as apiLogout } from "./auth";
import { getMe } from "./players";
import type { PlayerResponse } from "./types";
import { hasSession, subscribeSession } from "./session";
import { loginRoute, POST_AUTH_ROUTE, postAuthRoute, withNext } from "../routes";

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

/** A completed profile can act (create, join); an incomplete one only browses. */
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
 *
 * A token is all it takes: an incomplete profile browses freely (user,
 * 2026-09-27) and is sent to /profile-setup only when it tries to act — see
 * `useProfileGate`. The only effect is the navigation side-effect.
 */
export function useRequireAuth(): "checking" | "authed" {
  const router = useRouter();
  // Where to come back to: a share link lands on a guarded page, and sending
  // its opener to /matches after signing in loses the match they were invited to.
  const pathname = usePathname();
  const hydrated = useHydrated();
  const authed = useHasSession();

  useEffect(() => {
    if (hydrated && !authed) router.replace(loginRoute(pathname));
  }, [hydrated, authed, pathname, router]);

  return hydrated && authed ? "authed" : "checking";
}

/**
 * For anything that acts — create, join, accept. Returns `ready()`: true when
 * the profile is complete, otherwise it sends them to /profile-setup with a
 * `next` back to this page and returns false. `replace` for a page that is
 * itself the action (/matches/create), so «بعدا» there can't land back on it.
 * An unknown /me (loading, or the
 * backend failed) counts as ready, so a flaky call never blocks an action —
 * the server has the last word anyway.
 */
export function useProfileGate(): (opts?: { replace?: boolean }) => boolean {
  const router = useRouter();
  const pathname = usePathname();
  const authed = useHasSession();
  const { data: player } = useQuery({ ...meQuery, enabled: authed });
  const incomplete = player ? !isProfileComplete(player) : false;

  return useCallback(
    (opts?: { replace?: boolean }) => {
      if (!incomplete) return true;
      const to = withNext("/profile-setup", pathname);
      if (opts?.replace) router.replace(to);
      else router.push(to);
      return false;
    },
    [incomplete, pathname, router],
  );
}

/** For public auth pages (login/otp): send already-signed-in users into the app. */
export function useRedirectIfAuthed(): void {
  const router = useRouter();
  // Honours ?next= for the same reason useRequireAuth does: someone already
  // signed in who lands on /login from a share link still wants the match.
  const next = useSearchParams().get("next");

  useEffect(() => {
    if (hasSession()) router.replace(postAuthRoute(next));
  }, [next, router]);
}
