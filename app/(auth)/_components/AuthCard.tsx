interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full bg-black/50 backdrop-blur-card rounded-card px-6 py-7 flex flex-col gap-3 overflow-clip">
      <div dir="rtl" className="flex flex-col gap-1 text-right text-white">
        <p className="font-bold text-title leading-normal">{title}</p>
        {subtitle && (
          <p className="text-sm leading-normal opacity-90">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
