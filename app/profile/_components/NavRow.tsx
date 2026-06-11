import Link from "next/link";

interface Props {
  label: string;
  href: string;
  icon?: string;
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M9 12L5 8L9 4"
        stroke="#33A3FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NavRow({ label, href, icon }: Props) {
  const withIcon = Boolean(icon);

  return (
    <Link
      href={href}
      className={`bg-white border border-edge flex items-center justify-between w-full overflow-hidden shadow-card ${
        withIcon
          ? "h-14 rounded-[28px] pr-[7px] pl-4"
          : "rounded-[32px] px-4 py-3"
      }`}
    >
      <ArrowLeft />
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-soft" dir="rtl">
          {label}
        </span>
        {icon && (
          <div className="bg-[#F9F9F9] rounded-[24px] p-2 shrink-0">
            <img src={icon} alt="" className="size-6" aria-hidden />
          </div>
        )}
      </div>
    </Link>
  );
}
