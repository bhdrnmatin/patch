"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { regenerateInviteToken } from "@/lib/api/matches";
import { matchShareUrl, shareLink } from "@/lib/share";
import { ShareNodesIcon } from "./icons";

interface Props {
  /** Optional: level-based, and levels ship after the MVP. */
  restriction?: string;
  /** Match id — the link falls back to the match's own URL without a token. */
  matchId: string;
  /** The API's share token. The link it makes lets whoever opens it join
   *  directly, so a match with no token shares a plain link that does not. */
  inviteToken?: string;
  /** Organizer only: offer a replacement link, which revokes the shared one. */
  canRevoke?: boolean;
}

/**
 * Invite-link card. Tapping it opens the OS share sheet (Telegram, WhatsApp,
 * Instagram, SMS — whatever the phone has), and falls back to copying the link
 * where the Web Share API isn't available, e.g. desktop browsers.
 *
 * The native sheet is deliberate rather than per-app buttons: Instagram has no
 * public URL scheme for sending a link to a DM, so the share sheet is the only
 * route to it — and it covers every other app for free.
 *
 * The organizer also gets a way out of a link that went somewhere it shouldn't:
 * a new token, which kills the old one. That is why it asks twice.
 */
export default function ShareCard({ restriction, matchId, inviteToken, canRevoke }: Props) {
  const [copied, setCopied] = useState(false);
  // Replacing the link cannot be undone and breaks every copy already sent, so
  // the first tap only arms the second. The app confirms nothing else this way
  // because nothing else it does is irreversible for other people.
  const [armed, setArmed] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: revoke,
    isPending: revoking,
    isError: revokeFailed,
  } = useMutation({
    mutationFn: () => regenerateInviteToken(matchId),
    onSuccess: () => {
      setArmed(false);
      setRenewed(true);
      setTimeout(() => setRenewed(false), 4000);
      // The page is holding the old token; only a refetch brings the new one,
      // and sharing the stale one would hand out a link that 404s.
      queryClient.invalidateQueries({ queryKey: ["matchDetails", matchId] });
    },
  });

  // "failed" means no share sheet, no clipboard and no execCommand — then the
  // only thing left is to show the link so it can be copied by hand.
  const [fallbackUrl, setFallbackUrl] = useState("");

  const share = async () => {
    const url = matchShareUrl(matchId, inviteToken);
    const result = await shareLink(url, { title: "دعوت به مَچ", text: "بیا با هم بازی کنیم:" });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setFallbackUrl(result === "failed" ? url : "");
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={share}
        className="w-full bg-white rounded-full pl-5 pr-1 py-1 flex items-center justify-end gap-4 shadow-card active:opacity-80"
      >
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-sm font-bold text-ink-soft" dir="rtl">
            {copied ? "لینک کپی شد" : "به اشتراک گذاری"}
          </span>
          {/* Levels ship after the MVP, so a real match has no restriction —
              without this the label sat there with nothing after it. */}
          {restriction && (
            <span className="text-xs" dir="rtl">
              <span className="text-muted">محدودیت ورود: </span>
              <span className="text-ink-soft">{restriction}</span>
            </span>
          )}
        </div>
        <span className="shrink-0 p-4 rounded-full bg-surface text-ink-soft">
          <ShareNodesIcon />
        </span>
      </button>

      {fallbackUrl && (
        <p className="px-5 text-xs text-muted text-right leading-6" dir="rtl">
          کپی نشد. لینک:{" "}
          <span dir="ltr" className="select-all break-all text-ink-soft">
            {fallbackUrl}
          </span>
        </p>
      )}

      {canRevoke && (
        <div className="flex flex-col items-end gap-1 px-5 text-right">
          <button
            type="button"
            onClick={() => (armed ? revoke() : setArmed(true))}
            onBlur={() => setArmed(false)}
            disabled={revoking}
            aria-busy={revoking}
            className={`min-h-11 text-xs font-bold disabled:opacity-60 ${
              armed ? "text-danger" : "text-muted"
            }`}
            dir="rtl"
          >
            {revoking
              ? "در حال ساخت لینک تازه…"
              : renewed
                ? "لینک تازه ساخته شد"
                : armed
                  ? "مطمئنی؟ برای تایید دوباره بزن"
                  : "ساخت لینک تازه"}
          </button>
          {armed && !revoking && (
            <span className="text-tiny text-muted leading-5" dir="rtl">
              لینکی که قبلاً فرستاده‌ای دیگر کار نمی‌کند.
            </span>
          )}
          {revokeFailed && (
            <span role="alert" className="text-tiny text-danger leading-5" dir="rtl">
              ساخت لینک تازه انجام نشد. دوباره تلاش کن.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
