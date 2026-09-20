import AuthGuard from "../_components/AuthGuard";

/**
 * A share link is guarded like everything else — the API answers 401 on both
 * the preview and the join, so there is nothing to show a signed-out visitor
 * anyway. AuthGuard sends them to /login with a `next` back to this link, so
 * the match survives the sign-in (and a signup, via /profile-setup).
 */
export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
