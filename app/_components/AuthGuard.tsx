"use client";

import { useRequireAuth } from "@/lib/api/useAuth";

/**
 * Wraps protected routes. Holds rendering until the session is confirmed
 * (redirecting to /login when absent), so protected content never flashes for
 * signed-out users.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const status = useRequireAuth();
  if (status === "checking") {
    return (
      <div
        className="min-h-dvh flex items-center justify-center bg-surface"
        role="status"
        aria-label="در حال بارگذاری"
      >
        <span className="size-6 rounded-full border-2 border-edge border-t-primary animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
