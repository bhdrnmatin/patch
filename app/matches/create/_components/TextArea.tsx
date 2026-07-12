"use client";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Light multiline input: label above, white rounded box. */
export default function TextArea({ label, value, onChange, placeholder }: Props) {
  return (
    <label className="w-full flex flex-col gap-2">
      <span className="text-sm font-semibold text-ink-soft text-right" dir="rtl">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        dir="rtl"
        className="w-full min-h-28 rounded-group bg-white border border-edge px-4 py-3 text-sm leading-relaxed text-ink-soft placeholder:text-muted focus:outline-none focus:border-primary shadow-card resize-none"
      />
    </label>
  );
}
