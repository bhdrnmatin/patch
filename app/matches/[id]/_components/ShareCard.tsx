"use client";

import { useState } from "react";
import { ShareNodesIcon } from "./icons";

interface Props {
  restriction: string;
  /** Match id — the invite link is this match's own URL. */
  matchId: string;
}

/**
 * Invite-link card. Tapping it opens the OS share sheet (Telegram, WhatsApp,
 * Instagram, SMS — whatever the phone has), and falls back to copying the link
 * where the Web Share API isn't available, e.g. desktop browsers.
 *
 * The native sheet is deliberate rather than per-app buttons: Instagram has no
 * public URL scheme for sending a link to a DM, so the share sheet is the only
 * route to it — and it covers every other app for free.
 */
export default function ShareCard({ restriction, matchId }: Props) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/matches/${matchId}`;
    const data = { title: "دعوت به مَچ", text: "بیا با هم بازی کنیم:", url };

    if (navigator.share) {
      // Cancelling the sheet rejects — that's not an error worth surfacing.
      try {
        await navigator.share(data);
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure origin / permission) — nothing else to try.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="w-full bg-white rounded-full pl-5 pr-1 py-1 flex items-center justify-end gap-4 shadow-card active:opacity-80"
    >
      <div className="flex flex-col items-end gap-1 text-right">
        <span className="text-sm font-bold text-ink-soft" dir="rtl">
          {copied ? "لینک کپی شد" : "به اشتراک گذاری"}
        </span>
        <span className="text-xs" dir="rtl">
          <span className="text-muted">محدودیت ورود: </span>
          <span className="text-ink-soft">{restriction}</span>
        </span>
      </div>
      <span className="shrink-0 p-4 rounded-full bg-surface text-ink-soft">
        <ShareNodesIcon />
      </span>
    </button>
  );
}
