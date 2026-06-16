import type { MatchStatus } from "@/lib/types";
import PosterBadge from "./PosterBadge";

interface Props {
  poster: string;
  status: MatchStatus;
}

/** Square tournament poster, framed, with a status badge overlay. */
export default function TournamentPoster({ poster, status }: Props) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[20px] border-2 border-edge">
      <img src={poster} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute left-2 top-2">
        <PosterBadge status={status} />
      </div>
    </div>
  );
}
