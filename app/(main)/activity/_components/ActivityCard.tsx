import type { ActivityAction, ActivityItem, ActivityMetaLine } from "@/lib/types";
import StatusThumb from "./StatusThumb";
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

/** Activity list card: title + meta on the right, status thumbnail on the left, actions below. */
export default function ActivityCard({ item, onAction, busy, error }: Props) {
  const { image, status, title, meta, actions } = item;

  return (
    <article className="flex flex-col gap-3 rounded-group border border-divider bg-white p-2 shadow-card">
      <div className="flex gap-3">
        {/* Content fills the left; LTR flex so `items-end` right-aligns toward the thumbnail */}
        <div className="flex min-w-0 flex-1 flex-col items-end gap-2 pt-1 text-right">
          <h3 className="flex items-center gap-2 text-sm font-bold leading-6 text-ink-soft" dir="rtl">
            {title.map((part, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="h-3.5 w-px bg-edge" />}
                <span>{part}</span>
              </span>
            ))}
          </h3>
          <div className="flex flex-col items-end gap-2">
            {meta.map((line, i) => (
              <span key={i} dir="rtl" className={`text-tiny leading-none ${META_TONE[line.tone]}`}>
                {line.text}
              </span>
            ))}
          </div>
        </div>

        <StatusThumb image={image} status={status} />
      </div>

      {error && (
        <p role="alert" dir="rtl" className="px-2 text-tiny leading-5 text-danger-deep text-right">
          {error}
        </p>
      )}

      <div className="flex items-end justify-center gap-3">
        {actions.map((action, i) => (
          <ActivityButton
            key={i}
            {...action}
            disabled={busy}
            onClick={onAction && (() => onAction(action.kind))}
          />
        ))}
      </div>
    </article>
  );
}
