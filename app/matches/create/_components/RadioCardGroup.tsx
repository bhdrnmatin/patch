"use client";

export interface RadioCardOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Props {
  label: string;
  subtitle: string;
  options: RadioCardOption[];
  value: string | null;
  onChange: (id: string) => void;
}

/** Light radio-card list: section header + subtitle, then icon/title/description
 *  cards with a radio indicator (selected = blue border + filled check). */
export default function RadioCardGroup({ label, subtitle, options, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-base font-bold text-ink text-right" dir="rtl">
          {label}
        </span>
        <span className="text-xs text-muted text-right" dir="rtl">
          {subtitle}
        </span>
      </div>

      <div role="radiogroup" aria-label={label} className="flex flex-col gap-2">
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.id)}
              className={`w-full flex items-center gap-3 rounded-group p-4 bg-white border shadow-card active:opacity-90 ${
                selected ? "border-primary" : "border-edge"
              }`}
            >
              <span
                aria-hidden
                className={`size-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                  selected ? "bg-primary border-primary text-white" : "border-input-border"
                }`}
              >
                {selected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>

              <span className="flex-1 min-w-0 flex flex-col items-end gap-0.5">
                <span className="text-sm font-bold text-ink" dir="rtl">
                  {o.title}
                </span>
                <span className="text-xs text-muted leading-5 text-right" dir="rtl">
                  {o.description}
                </span>
              </span>

              <span className={`shrink-0 ${selected ? "text-primary" : "text-ink-soft"}`}>
                {o.icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
