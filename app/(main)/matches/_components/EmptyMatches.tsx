import Link from "next/link";
import { MatchesIcon } from "../../_components/BottomNav";

/** Shown on /matches when no matches exist at all (distinct from a filtered-out list). */
export default function EmptyMatches() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center" dir="rtl">
      <div className="size-16 rounded-full bg-surface flex items-center justify-center text-muted">
        <MatchesIcon />
      </div>
      <p className="text-base font-bold text-ink">هنوز مَچی نیست</p>
      <p className="text-sm text-muted">در حال حاضر مَچی برای نمایش وجود ندارد.</p>
      <Link
        href="/matches/create"
        className="mt-2 h-12 px-8 flex items-center justify-center rounded-pill bg-primary text-white text-sm font-bold"
      >
        ساخت مَچ
      </Link>
    </div>
  );
}
