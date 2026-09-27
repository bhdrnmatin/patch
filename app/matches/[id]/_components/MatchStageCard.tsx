import { toPersianDigits } from "@/lib/persian";

interface Props {
  title: string;
  nextLabel?: string;
  /** Omitted with `totalStages` — a cancelled match is not partway through anything. */
  stage?: number;
  /** Omitted for a state that isn't a step — a cancelled match draws no track. */
  totalStages?: number;
}

/** The three things a match goes through, in the order it goes through them. */
const STEPS = ["قبل از شروع", "در جریان", "ثبت نتیجه"];

/**
 * Where the match is: a three-step track, read right to left like the page —
 * done steps solid, the ball on the current one, the rest waiting. It
 * replaced a ring dial, which said «مرحله ۱ از ۳» without saying what the
 * steps *were*.
 */
export default function MatchStageCard({ title, nextLabel, stage, totalStages }: Props) {
  return (
    <section className="w-full rounded-[24px] bg-white p-4 flex flex-col gap-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        {totalStages !== undefined && (
          <span className="shrink-0 text-xs text-muted" dir="rtl">
            مرحله {toPersianDigits(String(stage ?? 0))} از {toPersianDigits(String(totalStages))}
          </span>
        )}
        <h2 className="flex-1 min-w-0 text-base font-bold text-ink text-right" dir="rtl">
          {title}
        </h2>
      </div>

      {totalStages !== undefined && (
        // dir="rtl" on the list so step one sits on the right.
        <ol className="flex gap-1.5" dir="rtl">
          {STEPS.slice(0, totalStages).map((label, i) => {
            const n = i + 1;
            const current = n === stage;
            const done = n < (stage ?? 0);
            return (
              <li key={label} className="flex-1 flex flex-col gap-2" aria-current={current ? "step" : undefined}>
                <span className={`relative h-2 rounded-pill ${done || current ? "bg-primary" : "bg-divider"}`}>
                  {/* The ball marks where the match is. */}
                  {current && (
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 rounded-full bg-accent ring-[3px] ring-white shadow-card" />
                  )}
                </span>
                <span className={`text-xs leading-none ${current ? "font-bold text-ink" : done ? "text-ink-soft" : "text-muted"}`}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {nextLabel && (
        <p className="text-xs text-right border-t border-divider pt-3" dir="rtl">
          <span className="text-muted">مرحله بعد: </span>
          <span className="font-bold text-ink-soft">{nextLabel}</span>
        </p>
      )}
    </section>
  );
}
