/**
 * Sharing a link from a page that may not be in a secure context.
 *
 * `navigator.share` and `navigator.clipboard` are **both** gated on a secure
 * context, and the app is tested on a phone over `http://192.168.1.x:3000` —
 * so on the device where sharing matters most, both are `undefined` and the
 * old code's `try { … } catch {}` swallowed it into a button that did nothing.
 *
 * The `execCommand("copy")` path is deprecated, not legacy cruft: it is the
 * only one that works over plain http, and production (https) never reaches it.
 */
export type ShareResult = "shared" | "copied" | "failed";

/** The URL a match is shared as: the one-tap join link, or the match itself. */
export function matchShareUrl(matchId: string, inviteToken?: string): string {
  const origin = window.location.origin;
  return inviteToken ? `${origin}/join/${inviteToken}` : `${origin}/matches/${matchId}`;
}

export async function shareLink(
  url: string,
  data: { title?: string; text?: string } = {},
): Promise<ShareResult> {
  if (navigator.share) {
    // Cancelling the sheet rejects, and that is not a failure worth reporting —
    // the user saw their options and chose none.
    try {
      await navigator.share({ ...data, url });
    } catch {}
    return "shared";
  }

  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {}

  try {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.setAttribute("readonly", "");
    // Off-screen but not `display:none` — an unrendered element can't be selected.
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, url.length); // iOS ignores select() alone
    const ok = document.execCommand("copy");
    ta.remove();
    if (ok) return "copied";
  } catch {}

  return "failed";
}
