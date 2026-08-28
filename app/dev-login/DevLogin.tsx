"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setTokens, DEV_BYPASS_TOKEN } from "@/lib/api/session";
import { POST_AUTH_ROUTE } from "@/lib/routes";

/**
 * Seeds a fake token so the client-side route guards let you through while the
 * API is unreachable. Nothing is actually bypassed server-side — the API still
 * rejects this token; the guarded pages just render their mock data.
 *
 * Empty refresh token on purpose: apiFetch only refreshes when one exists, so
 * the bypass never spends a request on /auth/refresh. The 401s the API does
 * return are exempted from ending the session in client.ts — without that, the
 * first guarded fetch would clear this token and bounce straight to /login.
 */
export default function DevLogin() {
  const router = useRouter();

  useEffect(() => {
    setTokens({ accessToken: DEV_BYPASS_TOKEN, refreshToken: "" });
    router.replace(POST_AUTH_ROUTE);
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-[430px] min-h-dvh bg-surface flex items-center justify-center">
      <p className="text-sm text-muted" dir="rtl">
        ورود آزمایشی…
      </p>
    </main>
  );
}
