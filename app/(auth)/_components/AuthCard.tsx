interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full bg-black/50 backdrop-blur-[5px] rounded-[32px] px-6 py-7 flex flex-col gap-3 overflow-clip">
      <div dir="rtl" className="flex flex-col gap-1 text-right text-white">
        <p className="font-bold text-[28px] leading-normal">{title}</p>
        {subtitle && (
          <p className="text-[14px] leading-normal opacity-90">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
