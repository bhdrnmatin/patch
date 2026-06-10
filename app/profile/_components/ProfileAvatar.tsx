interface Props {
  src: string;
  alt?: string;
}

export default function ProfileAvatar({ src, alt = "تصویر پروفایل" }: Props) {
  return (
    <div className="size-24 rounded-full overflow-hidden drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] shrink-0 bg-edge">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
