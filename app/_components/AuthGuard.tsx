"use client";

import { useRequireAuth } from "@/lib/api/useAuth";

/**
 * Wraps protected routes. Holds rendering until the session is confirmed
 * (redirecting to /login when absent), so protected content never flashes for
 * signed-out users.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const status = useRequireAuth();
  if (status === "checking") return null;
  return <>{children}</>;
}
