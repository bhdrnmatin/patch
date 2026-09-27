interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full bg-ink/65 backdrop-blur-[14px] border border-white/15 rounded-[28px] px-6 py-7 flex flex-col gap-3 overflow-clip shadow-[0_20px_50px_-20px_rgba(0,37,77,0.6)]">
      <div dir="rtl" className="flex flex-col gap-1 text-right text-white">
        <p className="font-display text-[34px] leading-[1.3]">{title}</p>
        {subtitle && (
          <p className="text-sm leading-normal opacity-90">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
