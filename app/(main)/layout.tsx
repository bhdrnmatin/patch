import BottomNav from "./_components/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[430px] min-h-dvh bg-white pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
