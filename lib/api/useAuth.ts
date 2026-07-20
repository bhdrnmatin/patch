"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { logout as apiLogout } from "./auth";
import { getMe } from "./players";
import { hasSession, subscribeSession } from "./session";

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

  const { data: player, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isAuthenticated,
    // Don't refetch /me on every tab refocus — a transient 401 from this flaky
    // backend shouldn't churn the session. Retry once to ride out blips.
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const logout = useCallback(async () => {
    await apiLogout();
    queryClient.removeQueries({ queryKey: ["me"] });
    router.replace("/login");
  }, [queryClient, router]);

  return { isAuthenticated, player, isLoading, logout };
}

/**
 * Gate a protected route. localStorage is client-only, so we stay "checking"
 * through SSR/first paint, then resolve to "authed" or redirect to /login.
 * The only effect is the navigation side-effect — no setState-in-effect.
 */
export function useRequireAuth(): "checking" | "authed" {
  const router = useRouter();
  const hydrated = useHydrated();
  const authed = useHasSession();

  useEffect(() => {
    if (hydrated && !authed) router.replace("/login");
  }, [hydrated, authed, router]);

  return hydrated && authed ? "authed" : "checking";
}

/** For public auth pages (login/otp): send already-signed-in users home. */
export function useRedirectIfAuthed(): void {
  const router = useRouter();

  useEffect(() => {
    if (hasSession()) router.replace("/");
  }, [router]);
}
