import { tournamentList } from "@/lib/mock";
import type { TournamentListItem } from "@/lib/types";

export async function getTournamentList(): Promise<TournamentListItem[]> {
  return tournamentList;
}
