"use client";

import InfoBanner from "../../[id]/_components/InfoBanner";
import InfoItem from "../../[id]/_components/InfoItem";
import { EditIcon } from "../../[id]/_components/icons";
import { CalendarIcon } from "../../../(main)/_components/icons";
import { WhistleIcon, CourtIcon, MatchesIcon } from "../../../(main)/_components/BottomNav";
import ReviewPlayers, { type ReviewRow } from "./ReviewPlayers";
import { toPersianDigits } from "../../../../lib/persian";
import { JALALI_MONTHS, isoToJalali } from "../../../../lib/jalali";
import type { CourtOption, CreateMatchDraft, MatchPlayer } from "../../../../lib/types";

const FORMAT_LABELS: Record<NonNullable<CreateMatchDraft["format"]>, string> = {
  competitive: "رقابتی",
  friendly: "دوستانه",
  americano: "آمریکانو",
};

/** Who can see the match, from step ۱. */
function inviteNote(draft: CreateMatchDraft): string | null {
  if (draft.invite === "private") return "این مَچ خصوصی است و فقط با لینک دعوت دیده می‌شود.";
  if (draft.invite === "public") return "این مَچ در فهرست مَچ‌ها دیده می‌شود.";
  return null;
}

/** "۱۴ مرداد ۱۴۰۵" from an ISO gregorian date. */
function jalaliLabel(iso: string): string {
  const { jy, jm, jd } = isoToJalali(iso);
  return `${toPersianDigits(String(jd))} ${JALALI_MONTHS[jm - 1]} ${toPersianDigits(String(jy))}`;
}

/** Add minutes to "HH:MM", wrapping at 24h. */
function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

interface Props {
  draft: CreateMatchDraft;
  courts: CourtOption[];
  players: MatchPlayer[];
  /** Jump back to a wizard step to change something. */
  onEdit: (step: number) => void;
}

/**
 * Step ۵ اتمام — a confirmation screen, not a preview of the match.
 *
 * It used to compose the match-details cards (`ScheduleCard`, `CourtCard`,
 * `DescriptionCard`), which is why it read as a record of something that
 * already exists: a 72px date banner, a club name at `text-display`, and five
 * full-bleed cards you had to scroll through to reach تایید و ثبت. Two of those
 * cards also carried controls that can't work here — a مسیریابی button and an
 * اضافه به تقویم button for a match with no id yet — plus a map of San
 * Francisco under a Karaj club.
 *
 * What a confirmation needs instead is every answer on one screen, each one a
 * tap away from the step that set it. Nothing here is a control except the edit
 * headers; the only forward action is the footer's.
 */
export default function StepReview({ draft, courts, players, onEdit }: Props) {
  const court = courts.find((c) => c.id === draft.courtId);
  const note = inviteNote(draft);
  const description = draft.description.trim();
  const title = draft.title.trim();

  const timeRange = draft.time
    ? `${toPersianDigits(draft.time)}${
        draft.duration ? ` تا ${toPersianDigits(addMinutes(draft.time, draft.duration))}` : ""
      }`
    : "—";

  const rows: ReviewRow[] = [
    { name: "شما", role: draft.myRole === "captain" ? "برگزار کننده" : "بازیکن" },
    ...draft.teammates.flatMap((t, i): ReviewRow[] => {
      const isCoach = draft.coach === i;
      // Invited numbers haven't accepted yet, so they carry no level or avatar.
      if (t.kind === "invite") {
        return [{ name: t.name, role: isCoach ? "برگزار کننده" : "دعوت‌شده" }];
      }
      const p = players[t.index];
      return p
        ? [{ name: p.name, role: isCoach ? "برگزار کننده" : "یار", level: p.level, avatar: p.avatar }]
        : [];
    }),
  ];

  return (
    <>
      {/* The visibility choice is the one answer that's costly to get wrong, so
          it stays a banner rather than becoming another quiet row. */}
      {note && <InfoBanner text={note} />}

      <section className="w-full bg-white rounded-group px-3 divide-y divide-divider shadow-card">
        <Group title="مشخصات" onEdit={() => onEdit(0)}>
          {/* نمایش isn't a tile — the banner above already says it, louder. */}
          <Tile wide={!title} icon={<WhistleIcon className="size-5" />} label="حالت بازی">
            {draft.format ? FORMAT_LABELS[draft.format] : "—"}
          </Tile>
          {title && (
            <Tile icon={<MatchesIcon className="size-5" />} label="عنوان">
              {title}
            </Tile>
          )}
          {description && (
            <p className="col-span-2 text-sm leading-relaxed text-ink-soft text-right" dir="rtl">
              {description}
            </p>
          )}
        </Group>

        <Group title="زمان‌بندی" onEdit={() => onEdit(2)}>
          <Tile icon={<CalendarIcon className="size-5" />} label="تاریخ">
            {draft.date ? jalaliLabel(draft.date) : "—"}
          </Tile>
          <Tile icon={<ClockIcon />} label="ساعت">
            {timeRange}
          </Tile>
        </Group>

        <Group title="مکان" onEdit={() => onEdit(1)}>
          <Tile wide icon={<CourtIcon className="size-5" />} label="زمین">
            {court?.club ?? "—"}
          </Tile>
          <Tile wide icon={<PinIcon />} label="نشانی">
            {court?.location ?? "—"}
          </Tile>
        </Group>
      </section>

      <ReviewPlayers rows={rows} onEdit={() => onEdit(3)} />
    </>
  );
}

/** One step's answers, with the whole header as the way back to that step. */
function Group({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="py-3 flex flex-col gap-3">
      {/* LTR wrapper so justify-between puts the pencil left and the title
          right — the flex trap in CLAUDE.md; dir="rtl" rides on the text. */}
      <button
        type="button"
        onClick={onEdit}
        aria-label={`ویرایش ${title}`}
        className="w-full h-11 flex items-center justify-between active:opacity-70"
      >
        <span className="size-8 flex items-center justify-center rounded-group bg-surface text-ink-soft">
          <EditIcon className="size-4" />
        </span>
        <span className="text-base font-bold text-ink" dir="rtl">
          {title}
        </span>
      </button>
      {/* dir="rtl" on the GRID so tiles fill from the right and a lone one sits
          there rather than leaving a gap. Safe here in a way it isn't on a flex
          row: it flips the grid's inline axis, which is the point. Each Tile
          re-declares dir="ltr" so InfoItem's `items-end` keeps meaning right. */}
      <div className="grid grid-cols-2 gap-3" dir="rtl">
        {children}
      </div>
    </div>
  );
}

/**
 * A value as a tile, not a row.
 *
 * Three label/value row layouts were tried and all read wrong on an RTL screen
 * — split to opposite edges the eye jumped the full width for the answer,
 * packed together the pair blurred into one phrase, stacked it turned into a
 * form. The idiom that works is already in the app: `InfoItem`, the surface
 * tile `/matches/[id]` uses for اطلاعات. At half width there's no gap to jump,
 * so the label/value stack reads at a glance. `wide` spans both columns — نشانی
 * needs it, and حالت بازی takes it when there's no عنوان beside it.
 */
function Tile({
  icon,
  label,
  wide,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "col-span-2" : "min-w-0"}>
      <InfoItem icon={icon} label={label}>
        {children}
      </InfoItem>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
