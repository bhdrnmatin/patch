import Link from "next/link";

interface Props {
  bgSrc?: string;
  onEditHref?: string;
}

function EditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfileHero({ bgSrc, onEditHref = "/profile/edit" }: Props) {
  return (
    <div className="relative h-[276px] bg-primary rounded-bl-[24px] rounded-br-[24px] overflow-hidden">
      {bgSrc && (
        <div className="absolute inset-0">
          <img
            src={bgSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/55" />
        </div>
      )}
      <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />

      {/* status bar spacer */}
      <div className="h-11" />

      <div className="relative z-10 flex items-center justify-between px-6 h-12">
        <Link
          href={onEditHref}
          className="size-12 flex items-center justify-center rounded-full bg-black/[0.16] border border-white/15 backdrop-blur-sm shrink-0"
          aria-label="ویرایش پروفایل"
        >
          <EditIcon />
        </Link>
        <h1
          className="text-white text-2xl font-bold drop-shadow-[0px_1px_4px_rgba(0,0,0,0.35)]"
          dir="rtl"
        >
          پروفایل
        </h1>
      </div>
    </div>
  );
}
