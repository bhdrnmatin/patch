import { toPersianDigits } from "../../../../lib/persian";
import type { FailedInvite } from "../../../../lib/data/mutations";

/**
 * The failure half of the success step: the match was created, some invites
 * weren't sent. A report, not a form — the way on is the footer's رفتن به مچ,
 * and the fix is the share card sitting right above it.
 */
export default function InviteFailures({ failed }: { failed: FailedInvite[] }) {
  return (
    <section className="w-full bg-white border border-edge rounded-group p-4 shadow-card flex flex-col gap-3">
      {/* LTR wrapper so items-end pins right; dir on the text itself. */}
      <div className="flex flex-col items-end text-right gap-1">
        <p dir="rtl" className="text-sm font-bold text-ink">
          این دعوت‌ها ارسال نشد
        </p>
        <p dir="rtl" className="text-xs text-muted leading-5">
          می‌توانید با لینک دعوت بالا اضافه‌شان کنید.
        </p>
      </div>
      <ul className="flex flex-col divide-y divide-divider">
        {failed.map((f) => (
          <li key={f.phone} className="flex flex-col items-end text-right gap-0.5 py-2">
            <span dir="ltr" className="text-sm font-bold text-ink-soft">
              {toPersianDigits(f.phone)}
            </span>
            <span dir="rtl" className="text-xs text-danger-deep leading-5">
              {f.reason}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
