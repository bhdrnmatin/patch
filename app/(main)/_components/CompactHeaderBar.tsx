"use client";

interface Props {
  /** Mirrors the hero's h1; decorative here, so it's hidden from the a11y tree. */
  title: string;
  visible: boolean;
  /** Optional actions (visual-left), e.g. the hero's filter/sort buttons. */
  children?: React.ReactNode;
}

/**
 * Slim blue bar pinned to the top once the tall hero has scrolled away, so the
 * page title and its actions stay reachable. The hero itself stays in flow and
 * scrolls off normally — nothing resizes, so the document never reflows and the
 * scroll position can't jump.
 *
 * `inert` while hidden keeps the off-screen copy of the actions out of the tab
 * order; the hero's originals take over (and vice versa).
 */
export default function CompactHeaderBar({ title, visible, children }: Props) {
  return (
    <div
      inert={!visible}
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] h-[100px] pt-11 bg-primary rounded-b-group shadow-pop transition-transform duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* LTR row: actions pin left, title pins right (CLAUDE.md rtl flex trap). */}
      <div className="h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">{children}</div>
        <span aria-hidden className="text-white text-lg font-bold leading-6" dir="rtl">
          {title}
        </span>
      </div>
    </div>
  );
}
