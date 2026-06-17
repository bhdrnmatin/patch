interface Props {
  /** Label pinned to the visual right (RTL section title). */
  right?: string;
  /** Label pinned to the visual left. */
  left?: string;
}

/** Hairline section separator with optional labels on either end. */
export default function SectionDivider({ right, left }: Props) {
  return (
    <div className="flex h-6 w-full items-center gap-3">
      {left && <span className="shrink-0 text-sm font-bold text-ink-soft">{left}</span>}
      <span className="h-px flex-1 bg-edge" />
      {right && (
        <span dir="rtl" className="shrink-0 text-sm font-bold text-ink-soft">
          {right}
        </span>
      )}
    </div>
  );
}
