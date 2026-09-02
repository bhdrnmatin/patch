"use client";

import { useRouter } from "next/navigation";
import CourtBackdrop from "../../../(main)/_components/CourtBackdrop";
import IconButton from "../../../(main)/_components/IconButton";
import ActionPill from "./ActionPill";
import { ArrowLeftIcon, SendIcon, EditIcon } from "./icons";

interface Props {
  title: string;
  showEdit?: boolean;
  /** Blurred stadium backdrop. Omitted by default — the hero is solid `bg-primary`. */
  bgImage?: string;
  /** Sharp athlete foreground. Omitted by default (no art). */
  athleteImage?: string;
}

/** Hero header: a drawn padel court, back button, match name, share/edit pills.
 *  The name is user data of any length, so it truncates at 32px rather than
 *  stepping down like the fixed list-page titles. */
export default function MatchDetailsHeader({ title, showEdit = true, bgImage, athleteImage }: Props) {
  const router = useRouter();

  return (
    <header className="relative mt-[var(--hero-gap)] w-full h-[276px] rounded-b-group overflow-hidden bg-primary">
      {!bgImage && !athleteImage && <CourtBackdrop />}

      {/* Blurred stadium backdrop behind the athlete cutout, mirrored per Figma.
          Sized relative to the frame (Figma: 502×335 at right -44 in a 390×276 frame)
          so it tracks the foreground athlete at any frame width. */}
      {bgImage && (
        <div className="absolute top-0 right-[-11.3%] w-[128.7%] h-[121.4%]">
          <img src={bgImage} alt="" className="size-full object-cover -scale-x-100 blur-[2px]" />
          <div className="absolute inset-0 bg-primary/55" />
        </div>
      )}
      {athleteImage && (
        <img src={athleteImage} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      {/* Scrim only on the photo path — the court's sky gradient carries the
          title on its own. */}
      {(bgImage || athleteImage) && (
        <div className="absolute inset-x-0 top-0 h-[141px] bg-gradient-to-b from-black/70 to-transparent" />
      )}
      <div className="absolute left-6 top-14">
        <IconButton icon={<ArrowLeftIcon />} label="برگشت" onClick={() => router.back()} />
      </div>
      <h1
        className="absolute right-6 top-[104px] max-w-[calc(100%-96px)] truncate text-[32px] font-bold leading-[1.15] text-white [text-shadow:0_4px_26px_rgba(2,26,55,0.45)]"
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
