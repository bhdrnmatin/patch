"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setTokens } from "@/lib/api/session";
import { POST_AUTH_ROUTE } from "@/lib/routes";

/**
 * Seeds a fake token so the client-side route guards let you through while the
 * API is unreachable. Nothing is actually bypassed server-side — the API still
 * rejects this token; the guarded pages just render their mock data.
 *
 * Empty refresh token on purpose: apiFetch only attempts a proactive refresh
 * when one exists, and a non-decodable access token counts as not-expired
 * (session.ts), so no auth request is made at all.
 */
export default function DevLogin() {
  const router = useRouter();

  useEffect(() => {
    setTokens({ accessToken: "dev-bypass", refreshToken: "" });
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
