import BottomNav from "./_components/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-[390px] pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
