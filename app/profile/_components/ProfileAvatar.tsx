"use client";

const DEFAULT_AVATAR = "/images/avatar-placeholder.svg";

interface Props {
  src?: string;
  alt?: string;
}

export default function ProfileAvatar({ src, alt = "تصویر پروفایل" }: Props) {
  return (
    <div className="size-24 rounded-full overflow-hidden border-2 border-white shadow-card shrink-0 bg-edge">
      <img
        src={src || DEFAULT_AVATAR}
        alt={alt}
        className="w-full h-full object-cover"
        // Fall back to the default silhouette if the uploaded photo fails to load.
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.endsWith("avatar-placeholder.svg")) img.src = DEFAULT_AVATAR;
        }}
      />
    </div>
  );
}
