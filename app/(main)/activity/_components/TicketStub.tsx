import type { ActivityItem } from "@/lib/types";

interface Props {
  stub: ActivityItem["stub"];
  /** Across the foot, e.g. «دعوت به مَچ». */
  status: string;
  /** Over or cancelled: the stub goes slate, like a ticket already torn. */
  used?: boolean;
}

/**
 * The stub of a match ticket: the day, big, and the kick-off under it, on the
 * court's run-off blue. It's what a player looks for in a list of their
 * matches — *when* — so it gets the display face; the court photo it replaced
 * was the same picture on every card.
 */
export default function TicketStub({ stub, status, used }: Props) {
  return (
    <div
      className={`relative w-[92px] shrink-0 flex flex-col items-center justify-between py-3 text-white ${used ? "bg-muted" : "bg-court-deep"}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 12.5%, transparent 12.5% 25%)",
      }}
    >
      <div className="flex flex-col items-center" dir="rtl">
        <span className="font-display text-[44px] leading-[1.05]">{stub.day}</span>
        <span className="text-xs font-bold leading-none text-white/85">{stub.month}</span>
      </div>
      <span className="font-display text-xl leading-none">{stub.clock}</span>
      <span dir="rtl" className="mx-2 rounded-pill bg-white/15 px-2 py-1 text-tiny font-bold leading-none whitespace-nowrap">
        {status}
      </span>
    </div>
  );
}
