interface StoryCardProps {
  title: string;
  description: string;
}

export default function StoryCard({ title, description }: StoryCardProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[362px] h-[198px] bg-black/50 backdrop-blur-[3.5px] rounded-3xl px-6 py-4 flex flex-col">
      <div dir="rtl" className="flex flex-col gap-1 text-right text-white">
        <p className="font-bold text-[22px] leading-normal whitespace-nowrap">
          {title}
        </p>
        <p className="text-[12px] leading-normal">
          {description}
        </p>
      </div>
    </div>
  );
}
