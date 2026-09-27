interface Props {
  name: string;
  avatar?: string;
  /** Pixel size of the circle. */
  size: number;
  className?: string;
}

/**
 * A player's face, or their initial when there is no photo.
 *
 * The backend answers a missing photo with its own stock silhouette
 * (`media.patchapp.ir/defaults/player-avatar.jpg`) rather than null, which put
 * the same grey figure on every seat. That counts as no photo here: a roster of
 * initials tells four people apart, four silhouettes don't.
 */
export default function PlayerMark({ name, avatar, size, className = "" }: Props) {
  const photo = avatar && !avatar.includes("/defaults/") ? avatar : undefined;
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.46 }}
      className={`shrink-0 rounded-full overflow-hidden bg-white text-ink font-display leading-none flex items-center justify-center ${className}`}
    >
      {photo ? <img src={photo} alt="" className="size-full object-cover" /> : name.trim().charAt(0)}
    </span>
  );
}
