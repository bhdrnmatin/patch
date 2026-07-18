import AuthGuard from "../_components/AuthGuard";

// Guards /matches/[id], /matches/create, /matches/[id]/results (the list at
// /matches lives under the (main) group and is guarded there).
export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
