import { ShareNodesIcon } from "./icons";

interface Props {
  restriction: string;
}

/** Share pill with entry-restriction meta, icon circle on the right. */
export default function ShareCard({ restriction }: Props) {
  return (
    <button
      type="button"
      className="w-full bg-white rounded-full pl-5 pr-1 py-1 flex items-center justify-end gap-4 drop-shadow-[0px_2px_1.5px_rgba(0,0,0,0.05)] active:opacity-80"
    >
      <div className="flex flex-col items-end gap-1 text-right">
        <span className="text-sm font-bold text-ink-soft" dir="rtl">
          به اشتراک گذاری
        </span>
        <span className="text-xs" dir="rtl">
          <span className="text-muted">محدودیت ورود: </span>
          <span className="text-ink-soft">{restriction}</span>
        </span>
      </div>
      <span className="shrink-0 p-4 rounded-full bg-surface text-ink-soft">
        <ShareNodesIcon />
      </span>
    </button>
  );
}
