"use client";

const DEFAULT_AVATAR = "/images/avatar-placeholder.svg";

interface Props {
  src?: string;
  alt?: string;
  /** Drawn as an initial when there is no photo of their own. */
  name?: string;
}

export default function ProfileAvatar({ src, alt = "تصویر پروفایل", name }: Props) {
  // The backend's stock silhouette counts as no photo (see PlayerMark).
  const own = src && !src.includes("/defaults/") ? src : undefined;
  if (!own && name?.trim()) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="size-24 rounded-full border-4 border-white shadow-float shrink-0 bg-ink text-white font-display text-[44px] leading-none flex items-center justify-center"
      >
        {name.trim().charAt(0)}
      </div>
    );
  }
  return (
    <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-float shrink-0 bg-edge">
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
