interface ProgressBarProps {
  total: number;
  current: number; // 0-indexed
}

export default function ProgressBar({ total, current }: ProgressBarProps) {
  return (
    <div className="absolute left-3 right-3 top-[66px] h-1 rounded-[40px] overflow-hidden">
      <div className="flex gap-[7px] h-full">
        {Array.from({ length: total }, (_, i) => {
          // RTL: rightmost segment = slide 0, so index (total-1-i) maps to visual order
          const isActive = total - 1 - i <= current;
          return (
            <div
              key={i}
              className={`flex-1 h-full rounded-[2.5px] transition-colors duration-300 ${
                isActive ? "bg-white" : "bg-white/20"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
