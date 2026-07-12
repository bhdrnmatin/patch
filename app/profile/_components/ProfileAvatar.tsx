interface Props {
  src: string;
  alt?: string;
}

export default function ProfileAvatar({ src, alt = "تصویر پروفایل" }: Props) {
  return (
    <div className="size-24 rounded-full overflow-hidden border-2 border-white shadow-card shrink-0 bg-white">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
