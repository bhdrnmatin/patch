"use client";

import { useRouter } from "next/navigation";
import IconButton from "../../../(main)/matches/_components/IconButton";
import ActionPill from "./ActionPill";
import { ArrowLeftIcon, SendIcon, EditIcon } from "./icons";

interface Props {
  title: string;
  showEdit?: boolean;
}

/** Hero header: athlete image on blue, back button, title, share/edit pills. */
export default function MatchDetailsHeader({ title, showEdit = true }: Props) {
  const router = useRouter();

  return (
    <header className="relative w-full h-[276px] rounded-b-3xl overflow-hidden bg-primary">
      {/* Blurred stadium backdrop behind the athlete cutout, mirrored per Figma.
          Sized relative to the frame (Figma: 502×335 at right -44 in a 390×276 frame)
          so it tracks the foreground athlete at any frame width. */}
      <div className="absolute top-0 right-[-11.3%] w-[128.7%] h-[121.4%]">
        <img
          src="/images/match-details-hero-bg.webp"
          alt=""
          className="size-full object-cover -scale-x-100 blur-[2px]"
        />
        <div className="absolute inset-0 bg-primary/55" />
      </div>
      <img
        src="/images/match-details-hero.webp"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />
      <div className="absolute left-6 top-14">
        <IconButton icon={<ArrowLeftIcon />} label="برگشت" onClick={() => router.back()} />
      </div>
      <h1
        className="absolute right-6 top-16 text-2xl font-bold leading-8 text-white [text-shadow:0px_1px_4px_rgba(0,0,0,0.35)]"
        dir="rtl"
      >
        {title}
      </h1>
      <div className="absolute bottom-4 inset-x-4 flex gap-3">
        <ActionPill icon={<SendIcon />} label="اشتراک گذاری" />
        {showEdit && <ActionPill icon={<EditIcon />} label="ویرایش" />}
      </div>
    </header>
  );
}
