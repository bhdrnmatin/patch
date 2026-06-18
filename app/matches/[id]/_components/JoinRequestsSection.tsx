import { Fragment } from "react";
import JoinRequestRow from "./JoinRequestRow";
import type { JoinRequest } from "../../../../lib/types";

interface Props {
  requests: JoinRequest[];
  matchId: string;
}

/** درخواست‌های ورود list, divider-separated (creator only). */
export default function JoinRequestsSection({ requests, matchId }: Props) {
  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="text-lg font-bold leading-6 text-ink text-right" dir="rtl">
        درخواست‌های ورود
      </h2>
      <div className="w-full flex flex-col">
        {requests.map((r, i) => (
          <Fragment key={r.id}>
            {i > 0 && <div className="w-full h-px bg-divider my-4" />}
            <JoinRequestRow request={r} matchId={matchId} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
