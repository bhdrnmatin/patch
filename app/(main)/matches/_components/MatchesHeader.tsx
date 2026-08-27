import type { DayOption } from "@/lib/types";
import SportPageHeader from "../../_components/SportPageHeader";

interface Props {
  days: DayOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onFilter: () => void;
  onSort: () => void;
}

/** Matches hero header — the shared SportPageHeader titled "مچ‌های روز". */
export default function MatchesHeader(props: Props) {
  return <SportPageHeader title="مچ‌های روز" {...props} />;
}
