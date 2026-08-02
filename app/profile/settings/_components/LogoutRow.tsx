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
      className="bg-white border border-edge flex items-center justify-between w-full overflow-hidden shadow-card h-14 rounded-full pr-[7px] pl-4 active:opacity-90 disabled:opacity-60"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-danger">
        <path
          d="M9 12L5 8L9 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-center gap-3">
        <span className="text-sm text-danger" dir="rtl">
          {pending ? "در حال خروج..." : "خروج از حساب"}
        </span>
        <div className="bg-surface rounded-full p-2 shrink-0 text-danger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="size-6">
            <path
              d="M15 12H3m0 0l4-4m-4 4l4 4M13 4h6a1 1 0 011 1v14a1 1 0 01-1 1h-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
