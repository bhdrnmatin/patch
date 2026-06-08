import Link from "next/link";

interface Props {
  bgSrc?: string;
  athleteSrc?: string;
  onEditHref?: string;
}

function EditIcon() {
  // Vuesax Linear "edit" icon
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.69l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94s-3.58-1.36-4.94 0Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.91 4.15A7.144 7.144 0 0 0 19.85 9.09"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfileHero({
  bgSrc = "/images/profile-hero-bg.webp",
  athleteSrc = "/images/profile-athlete.webp",
  onEditHref = "/profile/edit",
}: Props) {
  return (
    <div className="relative h-[276px] bg-primary rounded-bl-[24px] rounded-br-[24px] overflow-hidden">
      {/* Blurred court background + blue tint */}
      {bgSrc && (
        <div className="absolute inset-0 blur-[2px]">
          <img
            src={bgSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/55" />
        </div>
      )}

      {/* Sharp athlete foreground */}
      {athleteSrc && (
        <img
          src={athleteSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Top darkening gradient for title/button contrast */}
      <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />

      <Link
        href={onEditHref}
        className="absolute left-6 top-14 size-12 flex items-center justify-center rounded-full bg-black/[0.16] border border-white/15 backdrop-blur-sm"
        aria-label="ویرایش پروفایل"
      >
        <EditIcon />
      </Link>

      <h1
        className="absolute right-6 top-20 -translate-y-1/2 text-white text-2xl font-bold leading-8 drop-shadow-[0px_1px_4px_rgba(0,0,0,0.35)]"
        dir="rtl"
      >
        پروفایل
      </h1>
    </div>
  );
}
