import AuthGuard from "../_components/AuthGuard";
import BottomNav from "./_components/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[430px] min-h-dvh bg-surface pb-[calc(4rem+var(--safe-b))]">
      <AuthGuard>{children}</AuthGuard>
      <BottomNav />
    </div>
  );
}
