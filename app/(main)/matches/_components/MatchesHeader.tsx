import type { DayOption } from "@/lib/types";
import SportPageHeader from "../../_components/SportPageHeader";

interface Props {
  days: DayOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onFilter: () => void;
  onSort: () => void;
}

/** Matches hero header — the shared SportPageHeader titled "مَچ". */
export default function MatchesHeader(props: Props) {
  return <SportPageHeader title="مَچ" {...props} />;
}
