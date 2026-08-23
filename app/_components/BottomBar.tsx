/**
 * The frame every fixed bottom action bar shares — the wizard footer, the match
 * CTA, the profile save bar.
 *
 * It owns only what has to stay in sync across all three: where the bar sits,
 * how wide it gets, and the two Safari fixes that keep costing us. Those are
 * exactly the classes that changed twice in one day — `pb-[…--safe-b]` so the
 * buttons clear the home indicator, and `.fixed-bar` so Safari repaints the
 * whole thing when its children reflow — and each time all three copies had to
 * be found by hand.
 *
 * Everything cosmetic stays with the caller via `className`: the three bars
 * genuinely differ on border, top padding, inner layout and shadow, and
 * flattening those would be a redesign, not a refactor.
 */
export default function BottomBar({
  className = "",
  children,
  ref,
}: {
  className?: string;
  children: React.ReactNode;
  /** For callers that need the bar's measured height/position. */
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className={`fixed-bar fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white rounded-t-group px-6 pb-[calc(1.5rem+var(--safe-b))] ${className}`}
    >
      {children}
    </div>
  );
}
