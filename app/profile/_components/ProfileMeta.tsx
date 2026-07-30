interface Props {
  city: string;
  gender: string;
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="text-muted shrink-0">
      <path d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.19 5.19 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="text-muted shrink-0">
      <path
        d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM20.6 22c0-3.87-3.85-7-8.6-7s-8.6 3.13-8.6 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Chip({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white border border-edge rounded-full px-3 py-1.5 text-xs text-ink-soft shadow-card">
      {icon}
      <span dir="rtl">{value}</span>
    </span>
  );
}

/** City + gender as attribute chips (LTR wrapper so justify-end pins them right). */
export default function ProfileMeta({ city, gender }: Props) {
  return (
    <div className="flex justify-end gap-2 w-full">
      <Chip icon={<PersonIcon />} value={gender} />
      <Chip icon={<PinIcon />} value={city} />
    </div>
  );
}
