"use client";

import { useState } from "react";
import { useAuth } from "@/lib/api/useAuth";

/** Settings row that logs the user out (POST /auth/logout) and returns to /login. */
export default function LogoutRow() {
  const { logout } = useAuth();
  const [pending, setPending] = useState(false);

  const onClick = () => {
    setPending(true);
    logout(); // never throws; clears session + redirects to /login
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-busy={pending}
      className="bg-white border border-edge rounded-card px-4 py-3 flex items-center justify-between w-full shadow-card active:opacity-90 disabled:opacity-60"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-danger">
        <path
          d="M15 12H3m0 0l4-4m-4 4l4 4M13 4h6a1 1 0 011 1v14a1 1 0 01-1 1h-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm text-danger" dir="rtl">
        {pending ? "در حال خروج..." : "خروج از حساب"}
      </span>
    </button>
  );
}
