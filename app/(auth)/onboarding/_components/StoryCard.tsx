interface StoryCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function StoryCard({ title, description, children }: StoryCardProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[362px] bg-black/50 backdrop-blur-story rounded-3xl px-6 py-4 flex flex-col gap-3">
      <div dir="rtl" className="flex flex-col gap-1 text-right text-white">
        <p className="font-bold text-story-title leading-normal whitespace-nowrap">
          {title}
        </p>
        <p className="text-xs leading-normal">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
