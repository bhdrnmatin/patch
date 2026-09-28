import type { ActivityAction, ActivityItem, ActivityMetaLine } from "@/lib/types";
import TicketStub from "./TicketStub";
import ActivityButton from "./ActivityButton";

// faint maps to muted per the blessed gray-ramp rule (#92A7C1 → muted, no ramp token).
const META_TONE: Record<ActivityMetaLine["tone"], string> = {
  strong: "font-bold text-ink-soft",
  muted: "text-muted",
  faint: "text-muted",
};

interface Props {
  item: ActivityItem;
  /** The page owns what an action does — the card only reports which was tapped. */
  onAction?: (kind: ActivityAction["kind"]) => void;
  /** True while one of this card's actions is in flight. */
  busy?: boolean;
  /** What the server said when the last action failed. */
  error?: string;
}

/**
 * A match ticket: the stub (when) on the right, torn along a perforation from
 * the body (what, where, who asked) and its actions.
 */
export default function ActivityCard({ item, onAction, busy, error }: Props) {
  const { stub, status, title, meta, actions, used } = item;

  return (
    <article className="relative flex overflow-hidden rounded-[24px] bg-white shadow-float">
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 pr-4">
        {/* LTR column so `items-end` right-aligns; dir on the text. */}
        <div className="flex flex-col items-end gap-1.5 pt-1 text-right">
          <h3 className="flex items-center gap-2 text-base font-bold leading-6 text-ink" dir="rtl">
            {title.map((part, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="h-3.5 w-px bg-edge" />}
                <span>{part}</span>
              </span>
            ))}
          </h3>
          {meta.map((line, i) => (
            <span key={i} dir="rtl" className={`text-xs leading-4 ${META_TONE[line.tone]}`}>
              {line.text}
            </span>
          ))}
        </div>

        {error && (
          <p role="alert" dir="rtl" className="text-xs leading-5 text-danger-deep text-right">
            {error}
          </p>
        )}

        <div className="mt-auto flex items-end gap-1.5">
          {actions.map((action, i) => (
            <ActivityButton
              key={i}
              {...action}
              disabled={busy}
              onClick={onAction && (() => onAction(action.kind))}
            />
          ))}
        </div>
      </div>

      {/* The perforation, with a notch bitten out top and bottom. */}
      <div aria-hidden className="relative w-0 border-l-2 border-dashed border-edge">
        <span className="absolute -top-3 -left-[13px] size-6 rounded-full bg-background" />
        <span className="absolute -bottom-3 -left-[13px] size-6 rounded-full bg-background" />
      </div>

      <TicketStub stub={stub} status={status} used={used} />
    </article>
  );
}
