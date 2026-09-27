import Link from "next/link";
import CourtLineup from "../../_components/CourtLineup";

/**
 * Shown on /matches when the list comes back empty (distinct from a filtered-out
 * list): an empty court, every seat open — which is exactly what creating a
 * match makes.
 */
export default function EmptyMatches() {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center" dir="rtl">
      <div className="w-full rounded-[28px] bg-white p-2 shadow-float">
        <CourtLineup players={[]} capacity={4} open />
      </div>
      <p className="mt-2 font-display text-[26px] leading-[1.3] text-ink">هنوز مَچی ثبت نشده</p>
      <p className="-mt-2 text-sm text-muted">اولین مَچ را بساز؛ جای خالی‌اش را بقیه پر می‌کنند.</p>
      <Link
        href="/matches/create"
        className="mt-1 h-12 px-8 flex items-center justify-center rounded-[20px] bg-primary text-white text-sm font-bold"
      >
        ساخت مَچ
      </Link>
    </div>
  );
}
