import Link from "next/link";

interface Props {
  label: string;
  href: string;
  icon?: string;
  /** Render inactive with a "به زودی" label instead of navigating. */
  comingSoon?: boolean;
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-primary">
      <path
        d="M9 12L5 8L9 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NavRow({ label, href, icon, comingSoon }: Props) {
  const withIcon = Boolean(icon);
  const shape = withIcon ? "h-14 rounded-full pr-[7px] pl-4" : "rounded-card px-4 py-3";
  const base = `bg-white border border-edge flex items-center justify-between w-full overflow-hidden shadow-card ${shape}`;

  const inner = (
    <>
      {comingSoon ? (
        <span className="text-xs text-muted" dir="rtl">
          به زودی
        </span>
      ) : (
        <ArrowLeft />
      )}
      <div className="flex items-center gap-3">
        <span className={`text-sm ${comingSoon ? "text-muted" : "text-ink-soft"}`} dir="rtl">
          {label}
        </span>
        {icon && (
          <div className={`bg-surface rounded-full p-2 shrink-0 ${comingSoon ? "opacity-60" : ""}`}>
            <img src={icon} alt="" className="size-6" aria-hidden />
          </div>
        )}
      </div>
    </>
  );

  if (comingSoon) {
    return (
      <div className={`${base} cursor-default`} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <Link href={href} className={base}>
      {inner}
    </Link>
  );
}
