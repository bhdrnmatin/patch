"use client";

import FilterSection, {
  type ChipOption,
} from "../../../(main)/matches/_components/FilterSection";

const YES_NO: ChipOption[] = [
  { id: "yes", label: "بله" },
  { id: "no", label: "خیر" },
];

interface Props {
  label: string;
  /** null = unanswered. */
  enabled: boolean | null;
  onToggle: (enabled: boolean) => void;
  /** Dependent control, rendered when enabled === true. */
  children?: React.ReactNode;
}

/** White settings card: بله/خیر chip pair + conditional dependent control. */
export default function ToggleSetting({ label, enabled, onToggle, children }: Props) {
  return (
    <div className="w-full bg-white rounded-group p-3 flex flex-col gap-3 shadow-card">
      <FilterSection
        label={label}
        options={YES_NO}
        value={enabled === null ? "" : enabled ? "yes" : "no"}
        onChange={(id) => onToggle(id === "yes")}
      />
      {enabled && children}
    </div>
  );
}
